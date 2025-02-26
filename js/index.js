// ✅ Import Firebase modules
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { auth, db } from "./firebaseConfig.js"; // Ensure correct import

console.log("Firebase initialized successfully!");

// ✅ Handle Network Errors
function handleError(error) {
    if (error.code === "auth/network-request-failed") {
        alert("Network error! Please check your internet connection and try again.");
    } else {
        alert("Error: " + error.message);
    }
}



setPersistence(auth, browserLocalPersistence)
    .then(() => {
        console.log("Persistence enabled ✅");
    })
    .catch(error => console.error("Error setting persistence:", error));


// ✅ Register New User
document.getElementById("registerForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    const username = document.getElementById("registerUsername").value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const userId = userCredential.user.uid;

        // ✅ Store user info in Firebase Database
        await set(ref(db, "users/" + userId), {
            username: username,
            email: email
        });

        alert("Registration successful! Please log in.");
        showForm("login"); // Switch to login form
    } catch (error) {
        handleError(error);
    }
});

// ✅ Login User
document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        sessionStorage.setItem("userUID", userCredential.user.uid); // Store UID in session
        window.location.href = "dashboard.html"; // Redirect on success
    } catch (error) {
        handleError(error);
    }
});
