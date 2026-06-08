import { auth, db } from './firebase_config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc, updateDoc, arrayRemove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const profileWrapper = document.getElementById('profile-wrapper');
const logoutBtn = document.getElementById('logout-btn');
const licenseContainer = document.getElementById('owned-licenses-container');

// Synced Pricing Matrix Dictionary Map matching home/checkout parameters
const PRICE_LIST = {
    "Individual Monthly Standard": "9,99€/mo",
    "Individual Monthly Premium": "14,99€/mo",
    "Individual Yearly Standard": "95.99€/yr",
    "Individual Yearly Premium": "143.99€/yr",
    "Institutional 1-10 Users": "575,50€/yr",
    "Institutional 11-30 Users": "748,20€/yr",
    "Institutional 31+ Users": "1458,99€/yr"
};

onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            await loadProfileData(user);
        } catch (error) {
            console.error("Error reading profile data:", error);
        }
    } else {
        window.location.href = "login_register.html"; 
    }
});

// Separate display and loading pipeline for easy state re-rendering
async function loadProfileData(user) {
    const docRef = doc(db, "tutors", user.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        console.error("No profile record found in Firestore for this UID.");
        return;
    }

    const tutorData = docSnap.data();
    const firstName = tutorData.firstName || "";
    const lastName = tutorData.lastName || "";
    
    document.getElementById('welcome-heading').innerText = `Welcome, ${firstName}!`;
    document.getElementById('profile-fullname').innerText = `${firstName} ${lastName}`;
    document.getElementById('profile-email').innerText = user.email;
    document.getElementById('profile-birthday').innerText = tutorData.birthday || "Not set";
    
    const cloudLicenses = tutorData.ownedLicenses || [];
    document.getElementById('profile-license').innerText = `${cloudLicenses.length} Active`;
    
    const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
    document.getElementById('avatar-initials').innerText = initials || "T";

    // Dynamic License Render with accurate Prices and Cancel Button listeners
    if (licenseContainer) {
        if (cloudLicenses.length === 0) {
            licenseContainer.innerHTML = '<p class="empty-message" style="color: var(--text-main); opacity: 0.6; font-size: 0.95rem; text-align: left;">You haven\'t purchased any licenses yet.</p>';
        } else {
            licenseContainer.innerHTML = cloudLicenses.map(licenseName => {
                // Formatting helper string utility to cleanly read pricing definitions
                const priceLabel = PRICE_LIST[licenseName] || "Free Trial";
                const printableName = licenseName.replace(/-/g, ' ');

                return `
                    <div class="detail-row" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding: 8px 0;">
                        <div style="display: flex; flex-direction: column; text-align: left;">
                            <label style="font-weight: 600; margin: 0; text-transform: capitalize;">${printableName}</label>
                            <span style="font-size: 0.85rem; color: var(--accent-cyan); margin-top: 2px;">Cost: ${priceLabel}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 15px;">
                            <span style="color: #6DD4BE; font-weight: 500; font-size: 0.9rem;">Active ✓</span>
                            <button class="cancel-license-btn" data-license="${licenseName}" style="background: none; border: 1px solid rgba(220, 85, 78, 0.4); color: #DC554E; padding: 6px 12px; border-radius: 4px; font-family: 'SamiFont'; font-size: 0.8rem; cursor: pointer; transition: all 0.2s ease;">
                                Cancel
                            </button>
                        </div>
                    </div>
                `;
            }).join('');

            attachCancelListeners(user);
        }
    }
    profileWrapper.style.display = "block";
}

// Function to handle database element removal operations
function attachCancelListeners(user) {
    const cancelButtons = document.querySelectorAll('.cancel-license-btn');
    cancelButtons.forEach(btn => {
        // Add subtle style feedback on hover
        btn.addEventListener('mouseenter', (e) => {
            e.target.style.background = "#DC554E";
            e.target.style.color = "var(--bg-dark)";
        });
        btn.addEventListener('mouseleave', (e) => {
            e.target.style.background = "none";
            e.target.style.color = "#DC554E";
        });

        btn.addEventListener('click', async (e) => {
            const licenseToCancel = e.currentTarget.getAttribute('data-license');
            const userConfirmed = confirm(`Are you sure you want to cancel your registration for: "${licenseToCancel.replace(/-/g, ' ')}"?`);
            
            if (!userConfirmed) return;

            try {
                const docRef = doc(db, "tutors", user.uid);
                
                // Atomically scrub targeted database string asset entry item entry
                await updateDoc(docRef, {
                    ownedLicenses: arrayRemove(licenseToCancel)
                });

                alert("License successfully canceled.");
                
                // Force hot-reload of elements block content container locally inside view model
                await loadProfileData(user);

            } catch (error) {
                console.error("Database operation error during subscription cancellation:", error);
                alert("Failed to reach server. Subscription cancel operation dropped.");
            }
        });
    });
}

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