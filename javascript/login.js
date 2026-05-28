// 1. Import your configured auth helper instance from your config file
import { auth } from './firebase_config.js';

// 2. Import the official Firebase sign-in method
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Stop the page from refreshing on form submission

    // Extract input field values
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // 3. Attempt authentication against Firebase
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Login successful!
            const user = userCredential.user;
            console.log("Logged in successfully:", user.uid);
            alert("Welcome back!");
            
            // Redirect the user to your main app page or protected page
            window.location.href = "resources.html";
        })
        .catch((error) => {
            // Catch error states (such as wrong password, user not found)
            console.error("Login failure:", error.code, error.message);
            
            // Provide a friendly error alert
            if (error.code === 'auth/invalid-credential') {
                alert("Incorrect email or password. Please try again.");
            } else {
                alert("Login Error: " + error.message);
            }
        });
});