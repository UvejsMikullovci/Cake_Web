// src/components/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // <-- import auth

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDlU191ihhs9NvL3j5LizVD-zBOxSYH-y8",
  authDomain: "cakeweb-eff60.firebaseapp.com",
  projectId: "cakeweb-eff60",
  storageBucket: "cakeweb-eff60.appspot.com",  // <-- FIXED
  messagingSenderId: "431637329493",
  appId: "1:431637329493:web:0f655a9bc4b16a664cc6dc",
  measurementId: "G-YEETM4YJGG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app); // <-- export auth
