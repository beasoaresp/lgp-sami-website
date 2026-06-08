import { auth, db } from './firebase_config.js';
import { doc, getDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { updateCartBadge } from './navbar.js';
import { samiAlert, samiConfirm } from './alerts.js';

const PRICE_LIST = {
    "Individual Monthly Standard": 9.99,
    "Individual Monthly Premium": 14.99,
    "Individual Yearly Standard": 95.99,
    "Individual Yearly Premium": 143.99,
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


if (checkoutBtn) {
    checkoutBtn.addEventListener('click', async () => {
        const currentCart = JSON.parse(localStorage.getItem('SAMI_CART')) || [];

        if (currentCart.length === 0) {
            samiAlert('Your cart is empty! Please add a license');
            return;
        }

        const user = auth.currentUser;
        if (!user) {
            samiAlert('You must be logged in to purchase a license!');
            window.location.href = 'login_register.html';
            return;
        }

        try {
            const docRef = doc(db, "tutors", user.uid);
            const docSnap = await getDoc(docRef);
            
            if (!docSnap.exists()) {
                samiAlert("User profile not found.");
                return;
            }

            const tutorData = docSnap.data();
            const currentLicenses = tutorData.ownedLicenses || [];
            const nextLicense = tutorData.nextLicense || null;
            const newLicenseName = currentCart[0].name;

            if (currentLicenses.includes(newLicenseName) || nextLicense === newLicenseName) {
                samiAlert(`<span class="sami-alert-highlight">${newLicenseName}</span> has already been purchased for this account!`);
                return;
            }

            if (currentLicenses.length > 0) {
                const confirmExchange = await samiConfirm(
                    `You already have an active subscription. Do you want to update <span class="sami-alert-highlight">${newLicenseName}</span> as your next license? <br><br><span style="color: #DC554E; font-size: 0.85rem;">Warning: The funds will be automatically charged the moment this new plan starts.</span>`
                );

                if (!confirmExchange) return;

                await updateDoc(docRef, {
                    nextLicense: newLicenseName
                });
                
                // MENSAGEM CORRIGIDA: Sem "payment successful/processed"
                samiAlert(`<span class="sami-alert-highlight">${newLicenseName}</span> has been successfully placed in the queue. Payment will be processed once the new trial begins!`);
            } 
            else {
                await updateDoc(docRef, {
                    ownedLicenses: arrayUnion(newLicenseName)
                });
                
                samiAlert(`Payment successful! <span class="sami-alert-highlight">${newLicenseName}</span> is now active.`);
            }

            localStorage.removeItem('SAMI_CART'); 
            renderCart();
            updateCartBadge();

            setTimeout(() => {
                window.location.href = 'profile.html';
            }, 2000);

        } catch (error) {
            console.error("Database write error during checkout:", error);
            samiAlert("Payment failed while contacting account database. Please try again.");
        }
    });
}

renderCart();