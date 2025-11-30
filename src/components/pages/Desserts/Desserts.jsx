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
  deleteDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import "./Desserts.css";

const FILTERS = ["All", "Cakes", "Cookies", "Pies", "Wedding", "Other"];

const CakePopup = ({ product, onClose, favorites, toggleFavorite }) => {
  if (!product) return null;

  const isFavorite = favorites.includes(product.id);

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const favDocRef = doc(db, "users", user.uid, "favorites", product.id);

    try {
      if (isFavorite) {
        await deleteDoc(favDocRef);
        toggleFavorite(product.id, false);
      } else {
        await setDoc(favDocRef, {
          id: product.id,
          name: product.name,
          price: product.price,
          img: product.img,
          description: product.description,
          ingredients: product.ingredients,
          category: product.category,
          createdAt: product.createdAt || null,
          popularity: product.popularity || 0,
        });
        toggleFavorite(product.id, true);
      }
    } catch (err) {
      console.error("Error updating favorite:", err);
    }
  };

  return (
    <div className="popup-wrapper">
      <div className="popup-content">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        <button
          className={`popup-heart ${isFavorite ? "filled" : ""}`}
          onClick={handleFavoriteClick}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="heart-icon"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
              2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09
              C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5
              c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>

        <img src={product.img} alt={product.name} className="popup-image" />

        <div className="popup-details">
          <span className="popup-category">{product.category}</span>
          <h2 className="popup-title">{product.name}</h2>
          <p className="popup-description">{product.description}</p>
          <p className="popup-price">€{product.price.toFixed(2)}</p>

          <h3 className="ingredients-title">Ingredients:</h3>
          <ul className="ingredients-list">
            {product.ingredients.map((i, idx) => (
              <li key={idx}>{i}</li>
            ))}
          </ul>
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
  const [favorites, setFavorites] = useState([]);

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

    const auth = getAuth();
    if (auth.currentUser) {
      const userFavorites = collection(db, "users", auth.currentUser.uid, "favorites");
      const unsubFav = onSnapshot(userFavorites, (snapshot) => {
        setFavorites(snapshot.docs.map((doc) => doc.id));
      });
      return () => {
        unsub();
        unsubFav();
      };
    }

    return () => unsub();
  }, []);

  const toggleFavorite = (id, add) => {
    setFavorites((prev) => {
      if (add) return [...prev, id];
      return prev.filter((f) => f !== id);
    });
  };

  const handleCardFavorite = async (e, product) => {
    e.stopPropagation();
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const isFavorite = favorites.includes(product.id);
    const favDocRef = doc(db, "users", user.uid, "favorites", product.id);

    try {
      if (isFavorite) {
        await deleteDoc(favDocRef);
        toggleFavorite(product.id, false);
      } else {
        await setDoc(favDocRef, {
          id: product.id,
          name: product.name,
          price: product.price,
          img: product.img,
          description: product.description,
          ingredients: product.ingredients,
          category: product.category,
          createdAt: product.createdAt || null,
          popularity: product.popularity || 0,
        });
        toggleFavorite(product.id, true);
      }
    } catch (err) {
      console.error("Error updating favorite:", err);
    }
  };

  const filteredProducts = products.filter((p) =>
    activeFilter === "All" ? true : p.category === activeFilter
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0);
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
            From cakes to cookies, pies to wedding masterpieces – discover our full range of handcrafted delights.
          </p>
        </div>
      </section>

      <svg className="svgBaner" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86c82.39-16.72,168.19-17.73,250.45-.39
        C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35
        A600.21,600.21,0,0,0,321.39,56.44Z"></path>
      </svg>

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

      <div className="dessert-grid">
        {sortedProducts.map((item) => {
          const isFav = favorites.includes(item.id);
          return (
            <div
              className="dessert-card"
              key={item.id}
              onClick={() => setSelectedProduct(item)}
            >
              <div className="dessert-image-wrapper">
                {item.img && (
                  <img src={item.img} className="dessert-img" alt={item.name} />
                )}
                {/* Heart on card */}
                <button
                  className={`card-heart ${isFav ? "filled" : ""}`}
                  onClick={(e) => handleCardFavorite(e, item)}
                >
                  <i className="fa-solid fa-heart"></i>
                </button>
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
          );
        })}
      </div>

      <button className="build-your-dream-cake-btn">
        Build Your Dream Cake
      </button>

      <CakePopup
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
      />

      <section className="dessert-footer">
        <Footer />
      </section>
    </div>
  );
}
