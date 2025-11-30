import React, { useState } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { FiHeart } from "react-icons/fi";
import "./CakePopup.css";

function CakePopup({ product, onClose }) {
  const [loading, setLoading] = useState(false);

  if (!product) return null;

  // ✅ ADD TO FAVORITES
  const handleAddToFavorites = async () => {
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
        createdAt: new Date()
      });

      alert("Added to Favorites!");
    } catch (error) {
      console.error("Error adding favorite: ", error);
    }
  };

  // ADD TO CART (unchanged)
  const handleAddToCart = async () => {
    setLoading(true);

    try {
      const counterRef = doc(db, "orderCounters", "orders");
      const counterSnap = await getDoc(counterRef);
      let orderNumber = 1;

      if (counterSnap.exists()) {
        orderNumber = counterSnap.data().count + 1;
      }

      const orderId = `ORDER-${String(orderNumber).padStart(5, "0")}`;
      const orderRef = doc(db, "orders", orderId);

      await setDoc(orderRef, {
        id: orderId,
        items: [product],
        createdAt: new Date(),
        discount: 0,
        cardInfo: {}
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

          {/* ❤️ HEART BUTTON */}
          <div className="popup-icon" onClick={handleAddToFavorites}>
            <FiHeart className="pop-icon" />
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
