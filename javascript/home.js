// javascript/home.js
import { updateCartBadge } from './navbar.js';
import { samiAlert } from './alerts.js';

// 1. Get the current cart state from localStorage
let cart = JSON.parse(localStorage.getItem('SAMI_CART')) || [];

// 2. Target all your "Add to Cart" spans
const addToCartButtons = document.querySelectorAll('.currency-badge[data-item]');

// 3. The function that adds an item
function addToCart(event) {
    const itemName = event.target.getAttribute('data-item');
    
    const product = {
        name: itemName,
        addedAt: new Date().toISOString()
    };

    cart.push(product);
    
    // Save back to localStorage (available globally across the domain)
    localStorage.setItem('SAMI_CART', JSON.stringify(cart));
    
    // Refresh the badge using the imported function
    updateCartBadge();
    
    samiAlert(`${itemName} has been added to your cart!`);
}

// 4. Attach listeners
addToCartButtons.forEach(button => {
    button.addEventListener('click', addToCart);
});