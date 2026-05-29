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
                document.getElementById('profile-license').innerText = tutorData.license || "None";
                
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