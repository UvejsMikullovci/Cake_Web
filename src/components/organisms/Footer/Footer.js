import React from "react";
import "./Footer.css";
import { NavLink } from "react-router-dom";
import { useBrandTheme } from "../../../theme/BrandThemeProvider";

import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { IoCall } from "react-icons/io5";
import { MdEmail } from "react-icons/md";

export default function Footer() {
  const theme = useBrandTheme();

  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-brand">

          {/* Dynamic Logo */}
          <NavLink to="/" className="footer-logo">
            {theme.logoBase64 ? (
              <img src={theme.logoBase64} alt="Logo" className="footer-logo-img" />
            ) : (
              <span>🍰</span>
            )}
          </NavLink>

          <NavLink to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <h2>{theme.brandName || "CakeCrush"}</h2>
          </NavLink>

          <span className="subtitle">BAKERY</span>

          <p className="footer-desc">
            Handcrafted cakes & pastries made with love, quality ingredients,
            and a touch of magic.
          </p>

          <div className="footer-social">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaTwitter /></a>
          </div>
        </div>

        <div className="footer-column">
          <h3>Quick Links</h3>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/desserts">Desserts</NavLink>
          <NavLink to="/custom-cakes">Custom Cakes</NavLink>
          <NavLink to="/about">About Us</NavLink>
          <NavLink to="/gallery">Gallery</NavLink>
        </div>

        <div className="footer-column">
          <h3>Customer Service</h3>
          <a href="#">FAQ</a>
          <a href="#">Shipping Info</a>
          <a href="#">Returns</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms & Conditions</a>
        </div>

        <div className="footer-column">
          <h3>Contact Us</h3>
          <p className="footer-contact">
            <FaLocationDot /> 123 Sweet Street, Bakery Town, BT 12345
          </p>
          <p className="footer-contact">
            <IoCall /> (555) 123-4567
          </p>
          <p className="footer-contact">
            <MdEmail /> hello@cakecrush.com
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        © 2025 CakeCrush Bakery. All rights reserved. Made with 💕 and sugar.
      </div>
    </footer>
  );
}