// Array to hold cart items
let cart = JSON.parse(localStorage.getItem('SAMI_CART')) || [];

// DOM Elements
const cartBadge = document.getElementById('cartBadge');
const addToCartButtons = document.querySelectorAll('.currency-badge[data-item]');

// Update the visual cart counter badge
function updateCartUI() {
    if (cartBadge) {
        cartBadge.textContent = cart.length;
        
        // Add a tiny animation bump effect
        cartBadge.classList.add('bump');
        setTimeout(() => cartBadge.classList.remove('bump'), 200);
    }
}

// Add item to cart logic
function addToCart(event) {
    const itemName = event.target.getAttribute('data-item');
    
    // Create an item object (you can expand this with prices later)
    const product = {
        name: itemName,
        addedAt: new Date().toISOString()
    };

    cart.push(product);
    
    // Save to localStorage so it persists across pages
    localStorage.setItem('SAMI_CART', JSON.stringify(cart));
    
    // Refresh badge view
    updateCartUI();
    
    // Optional: User feedback
    alert(`${itemName} has been added to your cart!`);
}

// Event Listeners
addToCartButtons.forEach(button => {
    button.addEventListener('click', addToCart);
});

// Initialize UI layout on page load
document.addEventListener('DOMContentLoaded', updateCartUI);