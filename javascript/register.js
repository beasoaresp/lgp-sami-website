// 1. Import our configured auth and db instances
import { auth, db } from './firebase_config.js';

// 2. Import necessary functions from Firebase Authentication and Firestore SDKs
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const registerForm = document.getElementById('register-form');

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Stop page refresh

    // Capture values from input elements
    const firstName = document.getElementById('lfirstname').value;
    const lastName = document.getElementById('llastname').value;
    const birthday = document.getElementById('ldata').value;
    const email = document.getElementById('lemail').value;
    const password = document.getElementById('lpassword').value;
    const confirmPassword = document.getElementById('lconfirmpassword').value;

    // Simple password confirmation check
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    try {
        // Step A: Create User account in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Step B: Save profile details to Firestore under a "tutors" collection
        // We use the user's unique 'uid' as the document name so their profile maps perfectly to their account
        await setDoc(doc(db, "tutors", user.uid), {
            firstName: firstName,
            lastName: lastName,
            birthday: birthday,
            email: email,
            license: "None",
            role: "tutor",
            createdAt: new Date()
        });

        alert("Tutor registered successfully!");
        window.location.href = "home_page.html"; // Redirect them to your homepage or a dashboard

    } catch (error) {
        console.error("Registration error details:", error);
        alert("Error creating account: " + error.message);
    }
});