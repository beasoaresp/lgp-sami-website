import { auth, db } from './firebase_config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    const lessonsContainer = document.getElementById('lessons-display-container');
    const noLicenseMsg = document.getElementById('no-license-message');
    const pageTitle = document.getElementById('resources-title');

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                const docRef = doc(db, "tutors", user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const tutorData = docSnap.data();
                    const cloudLicenses = tutorData.ownedLicenses || [];

                    if (cloudLicenses.length > 0) {
                        if (lessonsContainer) lessonsContainer.style.display = 'flex';
                        if (pageTitle) pageTitle.style.display = 'block';
                        if (noLicenseMsg) noLicenseMsg.style.display = 'none';
                    } else {
                        showRestrictedUI();
                    }
                } else {
                    showRestrictedUI();
                }
            } catch (error) {
                console.error("Error checking verification parameters: ", error);
                showRestrictedUI();
            }
        } else {
            window.location.href = "login_register.html";
        }
    });

    function showRestrictedUI() {
        if (pageTitle) pageTitle.style.display = 'block';
        if (lessonsContainer) lessonsContainer.style.display = 'none';
        if (noLicenseMsg) noLicenseMsg.style.display = 'block';
    }
});