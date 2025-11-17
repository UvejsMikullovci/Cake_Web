import { NavLink } from "react-router-dom";
import { FiHeart, FiUser, FiShoppingCart,} from "react-icons/fi";
import { LuSparkles } from "react-icons/lu";
import logo from '../Photos/Logos/logo.jpg';
import cakee from '../Photos/Random/cakee.jpg' 
import React, { useState, useEffect } from "react";
import "./Home.css";

export default function Home() {

    const Counter = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 50); 
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setCount(Math.floor(start));
    }, 50);

    return () => clearInterval(timer);
  }, [end, duration]);

  return <h3>{count}+</h3>;
};

  return (
    <div className="home-wrapper">
      <nav className="navbar">
        <div className="logo">
            <img src={logo} alt="logo" className="logo-img" />
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
          <FiHeart className="icon" />
          <FiShoppingCart className="icon" />
          <NavLink to="/auth">
            <FiUser className="icon" />
          </NavLink>
           
        </div>
        <button className="dashboard-btn">Dashboard</button>
       </div>
      </nav>

      <section className="banner">
        <div className="banner-text">
          <span className="badge"><LuSparkles /> Freshly Baked Daily</span>

          <h1 className="title">
            Sweet Moments,<br />
            <span>Made Perfect</span>
          </h1>

          <p className="description">
            Handcrafted cakes, pastries, and desserts made with love and the finest ingredients.
            Every bite tells a story of quality and care.
          </p>

          <div className="buttons">
            <button className="btn-primary">Order Now →</button>
            <button className="btn-outline">Custom Cakes</button>
          </div>

          <div className="stats">
      <div>
        <Counter end={500} />
        <p>Happy Customers</p>
      </div>
      <div>
        <Counter end={50} />
        <p>Cake Varieties</p>
      </div>
      <div>
        <Counter end={10} />
        <p>Years Experience</p>
      </div>
    </div>
        </div>

        <div className="banner-img-wrapper">
          <img src={cakee} className="banner-img" alt="cake" />
        </div>
      </section>
    </div>
  );
}
