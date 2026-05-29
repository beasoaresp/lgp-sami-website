import { updateCartBadge } from './navbar.js';

const PRICE_LIST = {
    "Individual License": 49.99,
    "Institutional License": 299.99
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
    checkoutBtn.addEventListener('click', () => {
        // 1. Pull from the CORRECT storage key: 'SAMI_CART'
        const currentCart = JSON.parse(localStorage.getItem('SAMI_CART')) || [];

        if (currentCart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        // 2. Get existing owned licenses or initialize an empty array
        const ownedLicenses = JSON.parse(localStorage.getItem('SAMI_OWNED_LICENSES')) || [];

        // 3. Merge the cart items into the owned licenses list
        const updatedLicenses = [...ownedLicenses, ...currentCart];

        // 4. Save the updated licenses back to localStorage
        localStorage.setItem('SAMI_OWNED_LICENSES', JSON.stringify(updatedLicenses));

        // 5. Clear the actual cart key from storage
        localStorage.removeItem('SAMI_CART'); 

        // 6. Fix the UI (Re-render the now empty cart & reset the navbar badge icon)
        renderCart();
        updateCartBadge();

        alert('Payment successful! Licenses added to your account.');

        // 7. Redirect the user to the profile page
        window.location.href = 'profile.html';
    });
}

// FIX: Run the function immediately when the script executes so items actually display!
renderCart();