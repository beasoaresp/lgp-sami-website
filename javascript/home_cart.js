import { updateCartBadge } from './navbar.js';
import { samiAlert, samiConfirm } from './alerts.js';

let cart = JSON.parse(localStorage.getItem('SAMI_CART')) || [];
const addToCartButtons = document.querySelectorAll('.currency-badge[data-item]');

async function addToCart(event) {
    const itemName = event.target.getAttribute('data-item');
    
    if (cart.length > 0) {
        if (cart[0].name === itemName) {
            samiAlert("This license is already in your cart!");
            return;
        }

        const wantsToExchange = await samiConfirm(
            `You can only subscribe to one license. Do you wish to replace <span class="sami-alert-highlight">${cart[0].name}</span> with <span class="sami-alert-highlight">${itemName}</span>?`
        );

        if (!wantsToExchange) return;
        cart = [];
    }

    const product = {
        name: itemName,
        addedAt: new Date().toISOString()
    };

    cart.push(product);
    localStorage.setItem('SAMI_CART', JSON.stringify(cart));
    updateCartBadge();
    
    samiAlert(`${itemName} has been added to your cart!`);
}

addToCartButtons.forEach(button => {
    button.addEventListener('click', addToCart);
});