// 1. Import individual Firebase modules from matching CDN paths
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 2. Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyASHHCpI5rT-lORJGWKvvnq50ILJrxdUCI",
    authDomain: "sami-bdc42.firebaseapp.com",
    projectId: "sami-bdc42",
    storageBucket: "sami-bdc42.firebasestorage.app",
    messagingSenderId: "701368540399",
    appId: "1:701368540399:web:9a668747ad8688139dcf1a",
    measurementId: "G-ZXXM0DC4C2"
};

// 3. Initialize Firebase core app instance
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// 4. Initialize services using the initialized app instance
const auth = getAuth(app);
const db = getFirestore(app);

// 5. Export them cleanly to register.js
export { auth, db };