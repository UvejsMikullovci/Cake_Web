import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FiHeart, FiUser, FiShoppingCart } from "react-icons/fi";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase"; 
import logo from "../../Photos/Logos/logo.jpg";
import "./Navbar.css";

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  return (
    <nav className="navbar">
      <div className="logo">
        <NavLink to="/">
          <img src={logo} alt="logo" className="logo-img" />
        </NavLink>
      </div>

      <div className="nav-links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/desserts">Desserts</NavLink>
        <NavLink to="/custom-cakes">Custom Cakes</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/gallery">Gallery</NavLink>
        <NavLink to="/blog">Blog</NavLink>
        <NavLink to="/contact">Contact</NavLink>
      </div>

      <div className="nav-icon-button">
        <div className="nav-icons">
          <Link to="/favorites">
            <FiHeart className="icon" />
          </Link>

          <Link to="/checkout">
            <FiShoppingCart className="icon" />
          </Link>

          <NavLink to="/auth">
            <FiUser className="icon" />
          </NavLink>
        </div>

        {user ? (
          <a href="/dashboard">
            <button className="dashboard-btn">Dashboard</button>
          </a>
        ) : (
          <NavLink to="/auth">
            <button className="dashboard-btn">Register</button>
          </NavLink>
        )}
      </div>
    </nav>
  );
}