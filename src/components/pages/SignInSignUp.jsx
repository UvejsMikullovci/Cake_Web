import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import "./SignInSignUp.css";
import Navbar from "../organisms/Navbar";
import Footer from "../organisms/Footer";
import SignIn from '../Photos/Random/cakee.jpg';
import SignUp from '../Photos/Random/Artisanpastries.jpg';

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
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        navigate("/");
      } else {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
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
      <div className="auth-container">
        <div
          className="auth-left"
          style={{
            backgroundImage: `url(${isSignUp ? SignUp : SignIn})`,
          }}
        >
          <div className="auth-left-content">
            <img src="/icons/cake-icon.png" className="auth-left-icon" alt="" />
            <h1>{isSignUp ? "Join CakeCrush!" : "Welcome Back!"}</h1>
            <p>
              {isSignUp
                ? "Create an account to unlock exclusive perks, save favorites, and never miss a sweet deal."
                : "Sign in to access your orders, save favorites, and get exclusive offers."}
            </p>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-header">
            <img src="/icons/cake-icon.png" alt="" className="auth-logo" />
            <h2>{isSignUp ? "Create Account" : "Sign In"}</h2>
          </div>
          <form onSubmit={handleSubmit} className="auth-form">
            {isSignUp && (
              <div className="name-row">
                <input
                  name="firstName"
                  placeholder="First Name"
                  onChange={handleChange}
                />
                <input
                  name="lastName"
                  placeholder="Last Name"
                  onChange={handleChange}
                />
              </div>
            )}
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            {isSignUp && (
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            )}
            {errors && <p className="error">{errors}</p>}
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
            </button>
          </form>
          <div className="divider">
            <span>Or continue with</span>
          </div>
          <div className="social-buttons">
            <button className="google-btn">Google</button>
            <button className="fb-btn">Facebook</button>
          </div>
          <p className="toggle-text">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
            <span onClick={() => setIsSignUp(!isSignUp)}>
              {isSignUp ? " Sign in" : " Sign up"}
            </span>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SignInSignUp;
