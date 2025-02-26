import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.8.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.8.0/firebase-database.js";


// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCfphGGiIZAd6N8EOVHonOGvbqn0JFtEjE",
    authDomain: "test-587b5.firebaseapp.com",
    databaseURL: "https://test-587b5-default-rtdb.firebaseio.com",
    projectId: "test-587b5",
    storageBucket: "test-587b5.firebasestorage.app",
    messagingSenderId: "334705717433",
    appId: "1:334705717433:web:001176dcd0ec1740926b68"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

console.log("firebase is working")

export { app, auth, db };