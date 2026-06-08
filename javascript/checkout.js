import { auth, db } from './firebase_config.js';
import { doc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { updateCartBadge } from './navbar.js';

const PRICE_LIST = {
    "Individual Monthly Standard": 9.99,
    "Individual Monthly Premium": 14.99,
    "Individual Yearly Standard": 7.99,
    "Individual Yearly Premium": 11.99,
    "Institutional 1-10 Users": 575.50,
    "Institutional 11-30 Users": 748.20,
    "Institutional 31+ Users": 1458.99
};

const itemsContainer = document.getElementById('cart-items-container');
const totalDisplay = document.getElementById('cart-total');
const clearBtn = document.getElementById('clear-cart-btn');
const checkoutBtn = document.getElementById('checkout-btn');

function renderCart() {
    const cart = JSON.parse(localStorage.getItem('SAMI_CART')) || [];
    
    if (!itemsContainer) return;
    itemsContainer.innerHTML = '';

    if (cart.length === 0) {
        itemsContainer.innerHTML = `<p class="empty-message">Your cart is empty.</p>`;
        if (totalDisplay) totalDisplay.textContent = '0.00€';
        if (checkoutBtn) checkoutBtn.style.display = 'none';
        return;
    }

    if (checkoutBtn) checkoutBtn.style.display = 'block';
    let runningTotal = 0;

    cart.forEach((item, index) => {
        const itemPrice = PRICE_LIST[item.name] || 0.00;
        runningTotal += itemPrice;

        const row = document.createElement('div');
        row.className = 'detail-row';
        row.innerHTML = `
            <label>${item.name}</label>
            <div>
                <span>${itemPrice.toFixed(2)}€</span>
                <button class="remove-item-btn" data-index="${index}" style="background:none; border:none; color:#DC554E; cursor:pointer; margin-left:10px;">
                    <i class="fa fa-trash-o"></i>
                </button>
            </div>
        `;
        itemsContainer.appendChild(row);
    });

    if (totalDisplay) {
        totalDisplay.textContent = `${runningTotal.toFixed(2)}€`;
    }

    attachDeleteListeners();
}

function attachDeleteListeners() {
    const deleteButtons = document.querySelectorAll('.remove-item-btn');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetIndex = parseInt(e.currentTarget.getAttribute('data-index'));
            let cart = JSON.parse(localStorage.getItem('SAMI_CART')) || [];
            
            cart.splice(targetIndex, 1);
            localStorage.setItem('SAMI_CART', JSON.stringify(cart));
            
            renderCart();
            updateCartBadge();
        });
    });
}

if (clearBtn) {
    clearBtn.addEventListener('click', () => {
        localStorage.removeItem('SAMI_CART');
        renderCart();
        updateCartBadge();
    });
}

// Handle the checkout flow cleanly
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', async () => {
        const currentCart = JSON.parse(localStorage.getItem('SAMI_CART')) || [];

        if (currentCart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        // CRITICAL CHECK: Make sure the user is actually logged in before processing payment
        const user = auth.currentUser;
        if (!user) {
            alert('You must be logged in to purchase a license!');
            window.location.href = 'login_register.html';
            return;
        }

        try {
            // 1. Target this tutor's distinct document reference in Firestore
            const docRef = doc(db, "tutors", user.uid);

            // 2. Extract just the item names from the cart array
            const purchasedLicenseNames = currentCart.map(item => item.name);

            // 3. Save directly to Firebase using arrayUnion (avoids duplicates)
            await updateDoc(docRef, {
                ownedLicenses: arrayUnion(...purchasedLicenseNames)
            });

            // 4. Clear the local checkout cart since the database transaction succeeded
            localStorage.removeItem('SAMI_CART'); 
            renderCart();
            updateCartBadge();

            alert('Payment successful! Licenses permanently added to your cloud account.');
            window.location.href = 'profile.html';

        } catch (error) {
            console.error("Database write error during checkout:", error);
            alert("Payment failed while contacting account database. Please try again.");
        }
    });
}

// FIX: Run the function immediately when the script executes so items actually display!
renderCart();