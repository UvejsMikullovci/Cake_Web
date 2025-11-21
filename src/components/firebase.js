// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";  // <-- ADDED

// ✅ Your Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDlU191ihhs9NvL3j5LizVD-zBOxSYH-y8",
  authDomain: "cakeweb-eff60.firebaseapp.com",
  projectId: "cakeweb-eff60",
  storageBucket: "cakeweb-eff60.appspot.com",
  messagingSenderId: "431637329493",
  appId: "1:431637329493:web:0f655a9bc4b16a664cc6dc",
  measurementId: "G-YEETM4YJGG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth
export const auth = getAuth(app);

// Google Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

// ✅ Firestore DB
export const db = getFirestore(app);  // <-- ADDED

export default app;
