import { samiAlert } from './alerts.js';
import { auth } from './firebase_config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const loggedInElements = document.querySelectorAll('.show-logged-in');
const loggedOutElements = document.querySelectorAll('.show-logged-out');
const logoutBtn = document.getElementById('navbar-logout-btn');

onAuthStateChanged(auth, (user) => {
    if (user) {
        // --- USER IS LOGGED IN ---
        loggedInElements.forEach(el => el.style.setProperty('display', 'block', 'important'));
        loggedOutElements.forEach(el => el.style.setProperty('display', 'none', 'important'));
    } else {
        // --- USER IS LOGGED OUT ---
        loggedInElements.forEach(el => el.style.setProperty('display', 'none', 'important'));
        loggedOutElements.forEach(el => el.style.setProperty('display', 'block', 'important'));
    }
});

if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        signOut(auth).then(() => {
            samiAlert("Logged out successfully!");
            window.location.href = "home_page.html";
        });
    });
}

export function updateCartBadge() {
    const cartBadge = document.getElementById('cartBadge');
    if (cartBadge) {
        const cart = JSON.parse(localStorage.getItem('SAMI_CART')) || [];
        cartBadge.textContent = cart.length;
    }
}

document.addEventListener('DOMContentLoaded', updateCartBadge);