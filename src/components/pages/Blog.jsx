import React, { useEffect, useState } from "react";
import "./Blog.css";
import Navbar from "../organisms/Navbar";
import Footer from "../organisms/Footer";
import { db } from "../firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");

  const formatDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Fetch blog posts
  useEffect(() => {
    const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(list);
    });

    return () => unsub();
  }, []);

  // Filters from your dashboard
  const filters = [
    "All",
    "Tips & Tricks",
    "Guides",
    "Inspiration",
    "Recipes",
  ];

  const filteredPosts =
    activeFilter === "All"
      ? posts
      : posts.filter((p) => p.type === activeFilter);

  return (
    <div className="blog-wrapper">
      <Navbar />

      <div className="blog-hero">
        <h1>Our Blog</h1>
        <p>Tips, recipes, and sweet stories from the CakeCrush kitchen</p>

        <div className="blog-search">
          <i className="fi fi-rr-search"></i>
          <input type="text" placeholder="Search articles…" />
        </div>
      </div>

      <svg className="svgBaner" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path
          d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
          fill="#F7C0C3"
        ></path>
      </svg>

      <div className="blog-filters">
        {filters.map((filter, i) => (
          <button
            key={i}
            className={activeFilter === filter ? "active-filter" : ""}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="blog-grid">
        {filteredPosts.map((post) => {
          const dateText = formatDate(post.publishedAt);
          const minutes = post.readingTime || 5;

          return (
            <article className="blog-card" key={post.id}>
              <div className="blog-img-wrapper">
                {post.imageBase64 ? (
                  <img src={post.imageBase64} alt={post.title} />
                ) : (
                  <div className="blog-img-placeholder" />
                )}
                <span className="tag-label">{post.type}</span>
              </div>

              <h3>{post.title}</h3>
              <p>{post.content?.slice(0, 150)}...</p>

              <div className="blog-meta">
                <span>{dateText}</span>
                <span>•</span>
                <span>{minutes} min read</span>
              </div>

              <button className="read-btn">Read →</button>
            </article>
          );
        })}
      </div>

      <Footer />
    </div>
  );
}