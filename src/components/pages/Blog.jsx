import React from 'react';
import './Blog.css';
import Navbar from "../organisms/Navbar";
import Footer from "../organisms/Footer"; 

function Blog() {
  return (
    <div className="blog-container">
        <Navbar />
      <header className="blog-header">
        <h1>Our Blog</h1>
        <p>Tips, recipes, and sweet stories from the CakeCrush kitchen</p>
        <div className="search-bar">
          <input type="text" placeholder="Search articles..." />
        </div>
      </header>
      
      <nav className="blog-filter">
        <button className="filter-button active">All</button>
        <button className="filter-button">Tips & Tricks</button>
        <button className="filter-button">Recipes</button>
        <button className="filter-button">Wedding</button>
        <button className="filter-button">Events</button>
        <button className="filter-button">Behind the Scenes</button>
      </nav>

      <section className="blog-posts">
        <div className="featured-post">
          <img src="https://via.placeholder.com/300x200" alt="Featured Post" />
          <div className="post-details">
            <span className="category">Tips & Tricks</span>
            <h2>10 Tips for the Perfect Birthday</h2>
          </div>
        </div>
        {/* Add more posts below */}
      </section>

      <svg className="svgBaner" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#F7C0C3"></path>
      </svg>
        <Footer />
    </div>
  );
}

export default Blog;
