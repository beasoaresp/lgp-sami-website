
import { auth, db } from './firebase_config.js';
import { samiAlert } from './alerts.js';
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const registerForm = document.getElementById('register-form');

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const firstName = document.getElementById('lfirstname').value;
    const lastName = document.getElementById('llastname').value;
    const birthday = document.getElementById('ldata').value;
    const email = document.getElementById('lemail').value;
    const password = document.getElementById('lpassword').value;
    const confirmPassword = document.getElementById('lconfirmpassword').value;


    if (password !== confirmPassword) {
        samiAlert("Passwords do not match!");
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, "tutors", user.uid), {
            firstName: firstName,
            lastName: lastName,
            birthday: birthday,
            email: email,
            license: "None",
            role: "tutor",
            createdAt: new Date()
        });

        samiAlert("Registered successfully!");
        window.location.href = "home_page.html";

    } catch (error) {
        console.error("Registration error details:", error);
        samiAlert("Error creating account: " + error.message);
    }
});