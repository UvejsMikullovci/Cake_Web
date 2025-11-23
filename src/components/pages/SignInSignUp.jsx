// SignInSignUp.jsx
import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

import { auth, googleProvider, db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

import { useNavigate } from "react-router-dom";

import "./SignInSignUp.css";
import Navbar from "../organisms/Navbar";
import Footer from "../organisms/Footer";

import signinBg from "../Photos/Random/cakee.jpg";
import signupBg from "../Photos/Random/Artisanpastries.jpg";

const SignInSignUp = () => {
  const navigate = useNavigate();

  // -----------------------------
  // STATES
  // -----------------------------
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState({
    google: false,
  });

  // Handle Input
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Email validation
  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // ----------------------------------------------------
  // FIRESTORE USER CREATION / UPDATE
  // ----------------------------------------------------
  const saveUserToFirestore = async (user, firstName = "", lastName = "") => {
    const userRef = doc(db, "users", user.uid);

    const existingDoc = await getDoc(userRef);

    if (!existingDoc.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        firstName,
        lastName,
        createdAt: new Date(),
      });
    }
  };

  // -----------------------------
  // EMAIL/PASSWORD (Sign Up / Sign In)
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors("");

    if (!formData.email || !formData.password) {
      setErrors("Email and password are required.");
      return;
    }

    if (!validateEmail(formData.email)) {
      setErrors("Invalid email format.");
      return;
    }

    if (formData.password.length < 6) {
      setErrors("Password must be at least 6 characters.");
      return;
    }

    if (isSignUp && formData.password !== formData.confirmPassword) {
      setErrors("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        // CREATE NEW USER
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        const user = userCredential.user;

        await saveUserToFirestore(
          user,
          formData.firstName,
          formData.lastName
        );
      } else {
        // SIGN IN EXISTING USER
        const userCredential = await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        await saveUserToFirestore(userCredential.user);
      }

      navigate("/");
    } catch (err) {
      let msg = "Something went wrong.";

      if (err.code === "auth/email-already-in-use")
        msg = "Email already registered.";
      if (err.code === "auth/wrong-password")
        msg = "Invalid password.";
      if (err.code === "auth/user-not-found")
        msg = "User does not exist.";

      setErrors(msg);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // GOOGLE SIGN-IN
  // -----------------------------
  const handleGoogleLogin = async () => {
    setErrors("");
    setSocialLoading((prev) => ({ ...prev, google: true }));

    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;

      await saveUserToFirestore(user);

      navigate("/");
    } catch (err) {
      console.error("Google login error:", err);

      let msg = "Google login failed.";
      if (err.code === "auth/popup-blocked")
        msg = "Popup blocked. Please allow popups.";
      else if (err.code === "auth/popup-closed-by-user")
        msg = "Popup closed.";
      else if (err.code === "auth/cancelled-popup-request")
        msg = "Another popup is open.";

      setErrors(msg);
    } finally {
      setSocialLoading((prev) => ({ ...prev, google: false }));
    }
  };

  // -----------------------------
  // UI RENDER
  // -----------------------------
  return (
    <>
      <Navbar />

      <div className="auth-page">
        <div className="auth-card">
          <div
            className={`auth-left ${isSignUp ? "signup" : "signin"}`}
            style={{
              backgroundImage: `url(${isSignUp ? signupBg : signinBg})`,
            }}
          >
            <div className="auth-left-overlay" />

            <div className="auth-left-content">
              <div className="auth-left-icon-wrap">
                <span className="auth-left-icon">{isSignUp ? "🎂" : "🍰"}</span>
              </div>

              <h1 className="auth-left-title">
                {isSignUp ? "Join CakeCrush!" : "Welcome Back!"}
              </h1>

              <p className="auth-left-sub">
                {isSignUp
                  ? "Create an account to unlock perks and sweet deals."
                  : "Sign in to access your account and orders."}
              </p>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="auth-right">
            <div className="auth-header">
              <span className="auth-logo">🍰</span>
              <div className="brand-title">
                <span className="brand-name">CakeCrush</span>
                <span className="brand-sub">Bakery</span>
              </div>
            </div>

            <h2 className="auth-heading">
              {isSignUp ? "Create Account" : "Sign In"}
            </h2>

            <p className="auth-desc">
              {isSignUp
                ? "Sign up to start your sweet journey with us"
                : "Enter your credentials to access your account"}
            </p>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="auth-form" noValidate>
              {isSignUp && (
                <div className="name-row">
                  <input
                    name="firstName"
                    placeholder="First Name"
                    onChange={handleChange}
                    value={formData.firstName}
                    className="input"
                  />

                  <input
                    name="lastName"
                    placeholder="Last Name"
                    onChange={handleChange}
                    value={formData.lastName}
                    className="input"
                  />
                </div>
              )}

              <div className="field">
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div className="field password-row">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input"
                />

                {isSignUp && (
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="input"
                  />
                )}
              </div>

              {errors && <p className="error">{errors}</p>}

              <button disabled={loading} className="auth-btn" type="submit">
                {loading
                  ? "Please wait..."
                  : isSignUp
                  ? "Create Account"
                  : "Sign In"}
              </button>
            </form>

            <div className="divider">
              <span>Or continue with</span>
            </div>

            {/* SOCIAL BUTTONS */}
            <div className="social-buttons">
              <button
                className="social social-google"
                onClick={handleGoogleLogin}
                disabled={socialLoading.google || loading}
              >
                <span className="social-icon">G</span>
                {socialLoading.google ? "Signing in..." : "Google"}
              </button>
            </div>

            <p className="toggle-text">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
              <span
                className="toggle-link"
                onClick={() => setIsSignUp((prev) => !prev)}
              >
                {isSignUp ? " Sign in" : " Sign up"}
              </span>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default SignInSignUp;