import { auth, db } from './firebase_config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const profileWrapper = document.getElementById('profile-wrapper');
const logoutBtn = document.getElementById('logout-btn');

// Listen for user login/logout states
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // User is authenticated! Let's fetch their data from Firestore
        try {
            const docRef = doc(db, "tutors", user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const tutorData = docSnap.data();

                // Inject data into the DOM text nodes
                const firstName = tutorData.firstName || "";
                const lastName = tutorData.lastName || "";
                
                document.getElementById('welcome-heading').innerText = `Welcome, ${firstName}!`;
                document.getElementById('profile-fullname').innerText = `${firstName} ${lastName}`;
                document.getElementById('profile-email').innerText = user.email;
                document.getElementById('profile-birthday').innerText = tutorData.birthday || "Not set";
                const ownedLicensesArray = JSON.parse(localStorage.getItem('SAMI_OWNED_LICENSES')) || [];

                // 2. Count the elements in the array to get the active total
                const licenseCount = ownedLicensesArray.length;

                // 3. Print the number dynamically into your info card node
                document.getElementById('profile-license').innerText = `${licenseCount} Active`;
                
                // Set avatar initials dynamically
                const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
                document.getElementById('avatar-initials').innerText = initials || "T";

                // Reveal the content structure smoothly
                profileWrapper.style.display = "block";
            } else {
                console.error("No profile record found in Firestore for this UID.");
                alert("Profile data not found.");
            }
        } catch (error) {
            console.error("Error reading profile data:", error);
        }
    } else {
        // No active session! Kick them back out to your login terminal page
        window.location.href = "login_register.html"; 
    }
});

// Handle Account Sign Out Action
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

// Render dynamic licenses from checkout
document.addEventListener('DOMContentLoaded', () => {
    // Target a container in your profile HTML where licenses should live
    const licenseContainer = document.getElementById('owned-licenses-container'); 
    
    if (!licenseContainer) return;

    // FIX: Changed 'ownedLicenses' to 'SAMI_OWNED_LICENSES' to match checkout.js!
    const ownedLicenses = JSON.parse(localStorage.getItem('SAMI_OWNED_LICENSES')) || [];

    if (ownedLicenses.length === 0) {
        licenseContainer.innerHTML = '<p class="empty-message" style="color: var(--text-main); opacity: 0.6; font-size: 0.95rem;">You haven\'t purchased any licenses yet.</p>';
        return;
    }

    // Render each active license onto the profile page
    licenseContainer.innerHTML = ownedLicenses.map(item => `
        <div class="detail-row">
            <label>${item.name}</label>
            <span style="color: var(--accent-cyan); font-weight: 500;">Active License ✓</span>
        </div>
    `).join('');
});