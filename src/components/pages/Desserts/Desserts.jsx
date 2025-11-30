import React, { useState, useEffect } from "react";
import Navbar from "../../organisms/NavBar/Navbar";
import Footer from "../../organisms/Footer/Footer";
import { db } from "../../firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  doc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import "./Desserts.css";

// Filters for categories
const FILTERS = ["All", "Cakes", "Cookies", "Pies", "Wedding", "Other"];

// Popup component
const CakePopup = ({ product, onClose }) => {
  const [error, setError] = useState("");

  if (!product) return null;

  const addToFavorites = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      setError("You must be logged in to add favorites!");
      return;
    }

    try {
      await setDoc(
        doc(db, "users", user.uid, "favorites", product.id),
        {
          id: product.id,
          name: product.name,
          price: product.price,
          img: product.img,
          description: product.description,
          ingredients: product.ingredients,
          category: product.category,
          createdAt: product.createdAt || null,
          popularity: product.popularity || 0,
        }
      );
      setError("");
      alert("Added to favorites ❤️");
    } catch (err) {
      console.error(err);
      setError("Failed to add to Favorites!");
    }
  };

  return (
    <div className="popup-wrapper">
      <div className="popup-content">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        <img src={product.img} alt={product.name} className="popup-image" />

        <div className="popup-details">
          <span className="popup-category">{product.category}</span>
          <h2 className="popup-title">{product.name}</h2>
          {error && <p className="error">{error}</p>}
          <p className="popup-description">{product.description}</p>
          <p className="popup-price">€{product.price.toFixed(2)}</p>

          <h3 className="ingredients-title">Ingredients:</h3>
          <ul className="ingredients-list">
            {product.ingredients.map((ing, i) => (
              <li key={i}>{ing}</li>
            ))}
          </ul>

          <div className="popup-buttons">
            <button className="add-btn" onClick={addToFavorites}>
              ❤️ Add to Favorites
            </button>
            <button className="remove-btn" onClick={onClose}>
              ✖ Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Desserts() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortBy, setSortBy] = useState("popular");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch desserts from Firestore
  useEffect(() => {
    const q = query(collection(db, "desserts"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          name: data.title || "Untitled Dessert",
          price: Number(data.price) || 0,
          img: data.image || "",
          description: data.description || "",
          ingredients: Array.isArray(data.ingredients) ? data.ingredients : [],
          category: data.category || "Other",
          createdAt: data.createdAt || null,
          popularity: data.popularity ?? 0,
        };
      });
      setProducts(list);
    });

    return () => unsub();
  }, []);

  // Filter products by category
  const filteredProducts = products.filter((p) =>
    activeFilter === "All" ? true : p.category === activeFilter
  );

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "newest": {
        const getTime = (x) =>
          x.createdAt && typeof x.createdAt.toMillis === "function"
            ? x.createdAt.toMillis()
            : 0;
        return getTime(b) - getTime(a);
      }
      case "low":
        return a.price - b.price;
      case "high":
        return b.price - a.price;
      case "popular":
        return (b.popularity ?? 0) - (a.popularity ?? 0);
      default:
        return 0;
    }
  });

  return (
    <div className="dessert-wrapper">
      <Navbar />

      <section className="banner-collection">
        <div className="collection-text">
          <h1 className="collection-title">Our Dessert Collection</h1>
          <p className="collection-description">
            From cakes to cookies, pies to wedding masterpieces – discover our
            full range of handcrafted delights.
          </p>
        </div>
      </section>

      <svg
        className="svgBaner"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86c82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
      </svg>

      {/* Sort */}
      <div className="sort-section">
        <span>Sort by:</span>
        <select
          className="sort-dropdown"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="popular">Most Popular</option>
          <option value="newest">Newest</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
        </select>
      </div>

      {/* Filters */}
      <div className="filter-buttons">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            className={activeFilter === filter ? "active" : ""}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Dessert cards */}
      <div className="dessert-grid">
        {sortedProducts.map((item) => (
          <div
            className="dessert-card"
            key={item.id}
            onClick={() => setSelectedProduct(item)}
          >
            <div className="dessert-image-wrapper">
              {item.img && (
                <img
                  src={item.img}
                  className="dessert-img"
                  alt={item.name}
                />
              )}
            </div>

            <div className="dessert-card-body">
              <div className="dessert-tag-row">
                <span className="dessert-category-pill">{item.category}</span>
              </div>

              <h3 className="dessert-name">{item.name}</h3>

              <p className="dessert-description-card">
                {item.description || "Handcrafted dessert made with love."}
              </p>

              <div className="dessert-price-row">
                <span className="dessert-price">€{item.price.toFixed(2)}</span>

                <button
                  className="dessert-plus-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProduct(item);
                  }}
                >
                  <i className="fa-solid fa-plus" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="build-your-dream-cake-btn">
        Build Your Dream Cake
      </button>

      {/* Popup */}
      <CakePopup
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <section className="dessert-footer">
        <Footer />
      </section>
    </div>
  );
}
