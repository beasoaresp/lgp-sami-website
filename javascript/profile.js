import { auth, db } from './firebase_config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const profileWrapper = document.getElementById('profile-wrapper');
const logoutBtn = document.getElementById('logout-btn');
const licenseContainer = document.getElementById('owned-licenses-container');

onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            const docRef = doc(db, "tutors", user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const tutorData = docSnap.data();

                const firstName = tutorData.firstName || "";
                const lastName = tutorData.lastName || "";
                
                document.getElementById('welcome-heading').innerText = `Welcome, ${firstName}!`;
                document.getElementById('profile-fullname').innerText = `${firstName} ${lastName}`;
                document.getElementById('profile-email').innerText = user.email;
                document.getElementById('profile-birthday').innerText = tutorData.birthday || "Not set";
                
                // 1. Read the cloud licenses array right from Firestore document field
                const cloudLicenses = tutorData.ownedLicenses || [];
                
                // 2. Compute count dynamically from database data length
                document.getElementById('profile-license').innerText = `${cloudLicenses.length} Active`;
                
                // 3. Set avatar initials dynamically
                const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
                document.getElementById('avatar-initials').innerText = initials || "T";

                // 4. Dynamically print rows below into the list container
                if (licenseContainer) {
                    if (cloudLicenses.length === 0) {
                        licenseContainer.innerHTML = '<p class="empty-message" style="color: var(--text-main); opacity: 0.6; font-size: 0.95rem;">You haven\'t purchased any licenses yet.</p>';
                    } else {
                        licenseContainer.innerHTML = cloudLicenses.map(licenseName => `
                            <div class="detail-row">
                                <label>${licenseName}</label>
                                <span style="color: var(--accent-cyan); font-weight: 500;">Active License ✓</span>
                            </div>
                        `).join('');
                    }
                }

                profileWrapper.style.display = "block";
            } else {
                console.error("No profile record found in Firestore for this UID.");
                alert("Profile data not found.");
            }
        } catch (error) {
            console.error("Error reading profile data:", error);
        }
    } else {
        window.location.href = "login_register.html"; 
    }
});

if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        signOut(auth)
            .then(() => {
                alert("Logged out successfully!");
                window.location.href = "login_register.html";
            })
            .catch((error) => {
                console.error("Logout error:", error);
            });
    });
}