import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import "./SignInSignUp.css"; // optional CSS file

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false); // toggle between sign-in and sign-up
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors("");

    // Basic validation
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
        await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        alert("Sign-up successful! You can now sign in.");
      } else {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        alert("Sign-in successful!");
      }
      setFormData({ email: "", password: "" });
    } catch (err) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") setErrors("Email already in use.");
      else if (err.code === "auth/wrong-password") setErrors("Incorrect password.");
      else if (err.code === "auth/user-not-found") setErrors("User not found.");
      else setErrors("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
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

          <button type="submit" disabled={loading}>
            {loading ? "Please wait..." : isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <p className="toggle">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <span onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? "Sign In" : "Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
