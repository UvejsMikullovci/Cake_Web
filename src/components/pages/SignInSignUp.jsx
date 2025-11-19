import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";
import "./SignInSignUp.css";
import Navbar from "../organisms/Navbar";
import Footer from "../organisms/Footer"; 

const SignInSignUp = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors("");
    setSuccess("");

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

    setLoading(true);

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        setSuccess("Sign-up successful! You can now sign in.");
      } else {
        await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        setSuccess("Sign-in successful!");
      }

      setFormData({ email: "", password: "" });
    } catch (err) {
      let friendlyMessage = "Something went wrong. Please try again.";
      if (err.code) {
        switch (err.code) {
          case "auth/invalid-email":
            friendlyMessage = "Invalid email address.";
            break;
          case "auth/user-disabled":
            friendlyMessage = "This account has been disabled.";
            break;
          case "auth/user-not-found":
          case "auth/wrong-password":
            friendlyMessage = "Email or password is incorrect.";
            break;
          case "auth/email-already-in-use":
            friendlyMessage = "This email is already registered.";
            break;
          case "auth/weak-password":
            friendlyMessage = "Password should be at least 6 characters.";
            break;
        }
      }
      setErrors(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Navbar />
      <div className="auth-card">
        <h2>{isSignUp ? "Sign Up" : "Sign In"}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
            />
          </label>
          {errors && <p className="error">{errors}</p>}
          {success && <p className="success">{success}</p>}
          <button type="submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : isSignUp
              ? "Sign Up"
              : "Sign In"}
          </button>
        </form>
        <p className="toggle">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <span onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? "Sign In" : "Sign Up"}
          </span>
        </p>
      </div>
      <Footer/>
    </div>
  );
};

export default SignInSignUp;
