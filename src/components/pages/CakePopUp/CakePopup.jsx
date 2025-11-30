import React, { useState, useEffect } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { FiHeart } from "react-icons/fi";
import "./CakePopup.css";

function CakePopup({ product, onClose }) {
  const [loading, setLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // ✅ Always call hooks before any conditional return
  useEffect(() => {
    const checkFavorite = async () => {
      if (!product) return;
      try {
        const favRef = doc(db, "favorites", product.id);
        const favSnap = await getDoc(favRef);
        if (favSnap.exists()) {
          setIsFavorite(true);
        }
      } catch (error) {
        console.error("Error checking favorite: ", error);
      }
    };
    checkFavorite();
  }, [product]);

  if (!product) return null;

  // ✅ Add to Favorites (via heart icon only)
  const handleAddToFavorites = async () => {
    if (!product || isFavorite) return; // prevent multiple clicks

    try {
      const favRef = doc(db, "favorites", product.id);

      await setDoc(favRef, {
        id: product.id,
        name: product.name,
        price: product.price,
        img: product.img,
        description: product.description,
        ingredients: product.ingredients || [],
        category: product.category || "Other",
        createdAt: new Date(),
      });

      setIsFavorite(true); // mark as favorite
      alert("Added to Favorites!");
    } catch (error) {
      console.error("Error adding favorite: ", error);
      alert("Failed to add to Favorites!");
    }
  };

  // ✅ Add to Cart (unchanged)
  const handleAddToCart = async () => {
    if (!product || loading) return; // prevent multiple clicks
    setLoading(true);

    try {
      const counterRef = doc(db, "orderCounters", "orders");
      const counterSnap = await getDoc(counterRef);
      let orderNumber = 1;
      if (counterSnap.exists()) {
        const data = counterSnap.data();
        orderNumber = (data?.count || 0) + 1;
      }

      const orderId = `ORDER-${String(orderNumber).padStart(5, "0")}`;
      const orderRef = doc(db, "orders", orderId);

      await setDoc(orderRef, {
        id: orderId,
        items: [product],
        createdAt: new Date(),
        discount: 0,
        cardInfo: {},
      });

      await setDoc(counterRef, { count: orderNumber });

      alert(`Order ${orderId} added successfully!`);
      onClose();
    } catch (error) {
      console.error("Error adding order: ", error);
      alert("Failed to add order!");
    }

    setLoading(false);
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-container" onClick={(e) => e.stopPropagation()}>
        {/* LEFT SIDE IMAGE */}
        <div className="popup-left">
          <img src={product.img} alt={product.name} className="popup-img" />
        </div>

        {/* RIGHT SIDE INFO */}
        <div className="popup-right">
          {/* Heart Icon */}
          <div className="popup-icon" onClick={handleAddToFavorites}>
            <FiHeart
              className="pop-icon"
              style={{
                color: isFavorite ? "#f7c0c3ff" : "#581b28",
                cursor: isFavorite ? "default" : "pointer",
              }}
              size={35}
            />
          </div>

          <h1 className="popup-title">{product.name}</h1>

          <h3 className="popup-subtitle">Ingredients</h3>

          <ul className="popup-list">
            <div className="ingredients1">
              {product.ingredients?.slice(0, 2).map((ing, i) => (
                <li key={i}>{ing}</li>
              ))}
            </div>
            <div className="ingredients2">
              {product.ingredients?.slice(2, 4).map((ing, i) => (
                <li key={i}>{ing}</li>
              ))}
            </div>
          </ul>

          <p className="popup-desc">{product.description}</p>

          <h2 className="popup-price">€{product.price}</h2>

          {/* Add to Cart button */}
          <button
            className="popup-btn"
            onClick={handleAddToCart}
            disabled={loading}
          >
            {loading ? "Adding..." : "ADD TO CART"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CakePopup;
