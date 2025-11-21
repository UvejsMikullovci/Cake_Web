import React, { useEffect, useState } from "react";
import "./Blog.css";
import Navbar from "../organisms/Navbar";
import Footer from "../organisms/Footer"; 

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const dummyPosts = [
    {
      id: "1",
      title: "10 Tips for the Perfect Birthday Cake",
      description:
        "Planning a birthday celebration? Here are our top tips for choosing and customizing the perfect cake…",
      image:
        "https://images.unsplash.com/photo-1608198093002-ad4e005484b6?auto=format&q=80",
      tag: "Tips & Tricks",
      date: "Nov 10, 2025",
      read: "5 min read",
    },
    {
      id: "2",
      title: "Wedding Cake Trends 2025",
      description:
        "Discover the hottest wedding cake styles and flavors brides are loving this year…",
      image:
        "https://images.unsplash.com/photo-1609440292375-3e6a8bc39f55?auto=format&q=80",
      tag: "Wedding",
      date: "Nov 5, 2025",
      read: "7 min read",
    },
    {
      id: "3",
      title: "Our Secret Cookie Recipe",
      description:
        "We're sharing one of our most-requested recipes! Learn how to make our famous cookies at home…",
      image:
        "https://images.unsplash.com/photo-1559628233-1a3a5f0a88d3?auto=format&q=80",
      tag: "Recipes",
      date: "Oct 28, 2025",
      read: "4 min read",
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setPosts(dummyPosts);
      setLoading(false);
    }, 800);
  }, []);

  return (
    <div className="blog-wrapper">

      <Navbar />

      {/* TOP HEADER */}
      <div className="blog-hero">
        <h1>Our Blog</h1>
        <p>Tips, recipes, and sweet stories from the CakeCrush kitchen</p>

        <div className="blog-search">
          <i className="fi fi-rr-search"></i>
          <input type="text" placeholder="Search articles…" />
        </div>
      </div>

      {/* Wave Banner */}
      <svg className="svgBaner" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path
          d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
          fill="#F7C0C3"
        ></path>
      </svg>

      {/* CATEGORY FILTERS */}
      <div className="blog-filters">
        {["All", "Tips & Tricks", "Recipes", "Wedding", "Events", "Behind the Scenes"].map(
          (filter, i) => (
            <button key={i}>{filter}</button>
          )
        )}
      </div>

      {/* POSTS GRID */}
      {loading ? (
        <div className="loader">Loading Posts...</div>
      ) : (
        <div className="blog-grid">
          {posts.map((post) => (
            <div className="blog-card" key={post.id}>
              <div className="blog-img-wrapper">
                <img src={post.image} />
                <span className="tag-label">{post.tag}</span>
              </div>

              <h3>{post.title}</h3>
              <p>{post.description}</p>

              <div className="blog-meta">
                <span>{post.date}</span>
                <span>•</span>
                <span>{post.read}</span>
              </div>

              <button className="read-btn">Read →</button>
            </div>
          ))}
        </div>
      )}
      <Footer />
    </div>
  );
}
