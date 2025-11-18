import React from "react";
import "./Footer.css";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { IoCall } from "react-icons/io5";
import { MdEmail } from "react-icons/md";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* LEFT SIDE */}
        <div className="footer-brand">
          <div className="footer-logo">
  <span>🍰</span>
</div>
          <h2>CakeCrush</h2>
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

        {/* QUICK LINKS */}
        <div className="footer-column">
          <h3>Quick Links</h3>
          <a href="#">Home</a>
          <a href="#">Desserts</a>
          <a href="#">Custom Cakes</a>
          <a href="#">About Us</a>
          <a href="#">Gallery</a>
        </div>

        {/* CUSTOMER SERVICE */}
        <div className="footer-column">
          <h3>Customer Service</h3>
          <a href="#">FAQ</a>
          <a href="#">Shipping Info</a>
          <a href="#">Returns</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms & Conditions</a>
        </div>

        {/* CONTACT */}
        <div className="footer-column">
          <h3>Contact Us</h3>

          <p className="footer-contact"><FaLocationDot /> 123 Sweet Street, Bakery Town, BT 12345</p>
          <p className="footer-contact"><IoCall /> (555) 123-4567</p>
          <p className="footer-contact"><MdEmail /> hello@cakecrush.com</p>
        </div>
      </div>

      <div className="footer-bottom">
        © 2025 CakeCrush Bakery. All rights reserved. Made with 💕 and sugar.
      </div>
    </footer>
  );
}