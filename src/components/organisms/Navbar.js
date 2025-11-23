import React from "react";
import { Link, NavLink } from "react-router-dom";
import { FiHeart, FiUser, FiShoppingCart } from "react-icons/fi";
import logo from "../Photos/Logos/logo.jpg";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">

      {/* LOGO */}
      <div className="logo">
        <NavLink to="/">
          <img src={logo} alt="logo" className="logo-img" />
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

      {/* ICONS + BUTTON */}
      <div className="nav-icon-button">
        <div className="nav-icons">

          {/* HEART */}
          <FiHeart className="icon" />

          {/* CART → GO TO CHECKOUT */}
          <Link to="/checkout">
            <FiShoppingCart className="icon" />
          </Link>

          {/* USER */}
          <NavLink to="/auth">
            <FiUser className="icon" />
          </NavLink>
        </div>

        <button className="dashboard-btn">Dashboard</button>
      </div>
    </nav>
  );
}
