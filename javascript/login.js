
import { auth } from './firebase_config.js';
import { samiAlert } from './alerts.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Login successful
            const user = userCredential.user;
            console.log("Logged in successfully:", user.uid);
            samiAlert("Welcome back!");
            window.location.href = "resources.html";
        })
        .catch((error) => {
            console.error("Login failure:", error.code, error.message);
            
            if (error.code === 'auth/invalid-credential') {
                samiAlert("Incorrect email or password. Please try again.");
            } else {
                samiAlert("Login Error: " + error.message);
            }
        });
});