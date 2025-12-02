import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FiHeart, FiUser, FiShoppingCart } from "react-icons/fi";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase"; 
import { useBrandTheme } from "../../../theme/BrandThemeProvider";
import "./Navbar.css";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const theme = useBrandTheme();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  return (
    <nav className="navbar">
      {/* LOGO - Dynamic */}
      <div className="logo">
        <NavLink to="/">
          {theme.logoBase64 ? (
            <img src={theme.logoBase64} alt="Logo" className="logo-img" />
          ) : (
            <img src="/default-logo.png" alt="Logo" className="logo-img" />
          )}
        </NavLink>
      </div>

      {/* NAV LINKS */}
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
          <NavLink to="/dashboard">
            <button className="dashboard-btn">Dashboard</button>
          </NavLink>
        ) : (
          <NavLink to="/auth">
            <button className="dashboard-btn">Register</button>
          </NavLink>
        )}
      </div>
    </nav>
  );
}