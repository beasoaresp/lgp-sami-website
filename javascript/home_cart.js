import { updateCartBadge } from './navbar.js';

let cart = JSON.parse(localStorage.getItem('SAMI_CART')) || [];
const addToCartButtons = document.querySelectorAll('.currency-badge[data-item]');

function addToCart(event) {
    const itemName = event.target.getAttribute('data-item');
    const product = {
        name: itemName,
        addedAt: new Date().toISOString()
    };

    cart.push(product);
    localStorage.setItem('SAMI_CART', JSON.stringify(cart));
    updateCartBadge();
    
    alert(`${itemName} has been added to your cart!`);
}

addToCartButtons.forEach(button => {
    button.addEventListener('click', addToCart);
});