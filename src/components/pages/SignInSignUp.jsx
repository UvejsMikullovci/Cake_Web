// SignInSignUp.jsx
import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import "./SignInSignUp.css";
import Navbar from "../organisms/Navbar";
import Footer from "../organisms/Footer";

import signinBg from "../Photos/Random/cakee.jpg";
import signupBg from "../Photos/Random/Artisanpastries.jpg";

const SignInSignUp = () => {
  const navigate = useNavigate();
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

  const handleChange = (e) => {
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors("");

    if (!formData.email.trim() || !formData.password.trim()) {
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
        await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        navigate("/");
      } else {
        await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        navigate("/");
      }
    } catch (err) {
      let msg = "Something went wrong.";
      if (err.code === "auth/email-already-in-use") msg = "Email already registered.";
      if (err.code === "auth/wrong-password") msg = "Invalid password.";
      if (err.code === "auth/user-not-found") msg = "User does not exist.";
      setErrors(msg);
    } finally {
      setLoading(false);
    }
  };

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
                  ? "Create an account to unlock exclusive perks, save favorites, and never miss a sweet deal."
                  : "Sign in to access your orders, save favorites, and get exclusive offers."}
              </p>
            </div>
          </div>
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
            <form onSubmit={handleSubmit} className="auth-form" noValidate>
              {isSignUp && (
                <div className="name-row">
                  <input
                    name="firstName"
                    placeholder="First Name"
                    onChange={handleChange}
                    value={formData.firstName}
                    className="input"
                    autoComplete="given-name"
                  />
                  <input
                    name="lastName"
                    placeholder="Last Name"
                    onChange={handleChange}
                    value={formData.lastName}
                    className="input"
                    autoComplete="family-name"
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
                  autoComplete="email"
                />
              </div>
              <div className="field password-row">
                <div>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="input"
                    autoComplete={
                      isSignUp ? "new-password" : "current-password"
                    }
                  />
                </div>
                {isSignUp && (
                  <div>
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="input"
                      autoComplete="new-password"
                    />
                  </div>
                )}
              </div>
              {errors && <p className="error">{errors}</p>}
              <button type="submit" className="auth-btn" disabled={loading}>
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
            <div className="social-buttons">
              <button className="social social-google">
                <span className="social-icon">G</span> Google
              </button>
              <button className="social social-fb">
                <span className="social-icon">f</span> Facebook
              </button>
            </div>
            <p className="toggle-text">
              {isSignUp
                ? "Already have an account?"
                : "Don't have an account?"}
              <span
                className="toggle-link"
                onClick={() => setIsSignUp((s) => !s)}
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
