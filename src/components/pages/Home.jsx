import { LuSparkles } from "react-icons/lu";
import cakee from '../Photos/Random/cakee.jpg';
import ppink from  '../Photos/Random/ppink.jpg'
import ArtisanPastries from '../Photos/Random/Artisanpastries.jpg';
import birthdaycake from '../Photos/Random/birthdaycake.jpg';
import cookies from '../Photos/Random/cookies.jpg';
import pies from '../Photos/Random/pies.jpg';
import weddingcake from '../Photos/Random/weddingcake.jpg';
import React, { useState, useEffect } from "react";
import { FiEye, FiShoppingCart } from "react-icons/fi";
import { Heart, Star, Sparkles } from "lucide-react";
import Navbar from "../organisms/Navbar";
import Footer from "../organisms/Footer";
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
const items = [
  {
    id: 1,
    title: "Pink Dream Cake",
    price: "$45.99",
    img: cakee
  },
  {
    id: 2,
    title: "Artisan Pastries Box",
    price: "$32.99",
    img: ArtisanPastries
  },
  {
    id: 3,
    title: "Wedding Elegance",
    price: "$250.00",
    img: weddingcake
  },
  {
    id: 4,
    title: "Birthday Celebration",
    price: "$55.00",
    img: birthdaycake
  },
  {
    id: 5,
    title: "Cookie Collection",
    price: "$24.00",
    img: cookies
  },
  {
    id: 6,
    title: "Homemade Pies",
    price: "$28.50",
    img: pies
  }
];

const cards = [
{
icon: <Heart size={40} strokeWidth={1.5} />,
title: "Weddings",
text: "Elegant custom wedding cakes that make your special day unforgettable",
},
{
icon: <Star size={40} strokeWidth={1.5} />,
title: "Birthdays",
text: "Fun and colorful birthday cakes that bring joy to any celebration",
},
{
icon: <Sparkles size={40} strokeWidth={1.5} />,
title: "Special Events",
text: "Custom creations for corporate events, baby showers, and more",
},
];
 const steps = [
    {
      number: "1",
      title: "Choose Your Cake",
      text: "Browse our delicious selection",
    },
    {
      number: "2",
      title: "Customize",
      text: "Add your personal touches",
    },
    {
      number: "3",
      title: "Place Order",
      text: "Secure checkout process",
    },
    {
      number: "4",
      title: "Enjoy!",
      text: "Pick up or get it delivered",
    },
  ];
  const posts = [
    {
      img: birthdaycake,
      tag: "Tips & Tricks",
      title: "10 Tips for the Perfect Birthday Cake",
    },
    {
      img: weddingcake,
      tag: "Wedding",
      title: "Wedding Cake Trends 2025",
    },
    {
      img: cookies,
      tag: "Recipes",
      title: "Our Secret Cookie Recipe",
    },
  ];


  return (
    <div className="home-wrapper">
        <Navbar/>
   
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
          <div className="bouncy-cake">
           <span className="cake-emoji">🎂</span>
        </div>
          <div className="cookie">
           <span className="cookie-emoji"> 🍪</span>
        </div>
        </div>
        
      </section>
      <section className="banner2">
         <div className="signature-section">
          
      <div className="pink-wave"> <img src={ppink} className="wave-image" alt="wave" /></div>

      <h2 className="signature-title">Our Signature Sweets</h2>
      <p className="signature-subtitle">
        Discover our most loved creations, baked fresh every day with premium ingredients
      </p>

      <div className="cards-grid">
        {items.map((item) => (
          <div key={item.id} className="sweet-card">
            <div className="image-wrapper">
              <img src={item.img} alt={item.title} />
              <div className="hover-overlay">
                <div className="hover-icons">
                  <div className="Eye">
                  <FiEye />
                  </div>
                  <div className="shopcart">
                  <FiShoppingCart />
                  </div>
                </div>
                
              </div>
            </div>

            <p className="card-title">{item.title}</p>
            <p className="card-price">{item.price}</p>
          </div>
        ))}
      </div>

      <button className="view-all-btn">View All Desserts →</button>
    </div>
      </section>
      <section className="banner3">
        <div className="occasion-section">
<h1 className="occasion-title">Best Choice for Every Occasion</h1>


<div className="occasion-grid">
{cards.map((c, i) => (
<div key={i} className="occasion-card">
<div className="occasion-icon">{c.icon}</div>
<h2 className="occasion-card-title">{c.title}</h2>
<p className="occasion-card-text">{c.text}</p>
</div>
))}
</div>
</div>
      </section>
      <section className="banner4">
         <div className="how-section">
      <h1 className="how-title">How to Order</h1>
      <p className="how-subtext">
        Simple steps to get your perfect cake
      </p>

      <div className="how-grid">
        {steps.map((step, i) => (
          <div className="how-card" key={i}>
            <div className="how-circle">{step.number}</div>
            <h2 className="how-card-title">{step.title}</h2>
            <p className="how-card-text">{step.text}</p>
          </div>
        ))}
      </div>
      <div className="pink-wave2"> <img src={ppink} className="wave-image2" alt="wave" /></div>
    </div>
      </section>
      <section className="blog-section">
         <div className="blog-section">
      <h1 className="blog-title">Latest from Our Blog</h1>

      <div className="blog-grid">
        {posts.map((post, i) => (
          <div className="blog-card" key={i}>
            <div className="blog-image-wrapper">
              <img src={post.img} alt={post.title} className="blog-img" />
              <span className="blog-tag">{post.tag}</span>
            </div>

            <div className="blog-content">
              <h2 className="blog-card-title">{post.title}</h2>

              <button className="blog-readmore">
                Read More <span>→</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="blog-footer">
        <button className="blog-view-all">View All Posts</button>
      </div>
    </div>
      </section>
      <section className="subscribe-banner">
           <div className="newsletter-banner">
      <h2>🍰 Sweet Deals in Your Inbox</h2>
      <p>Subscribe to get exclusive offers, new product alerts, and baking tips!</p>

      <div className="newsletter-form">
        <input type="email" placeholder="Enter your email" />
        <button>Subscribe</button>
      </div>
    </div>
      </section>
      <section className="footer-section">
      <Footer/>
      </section>
    </div>
  );
}
