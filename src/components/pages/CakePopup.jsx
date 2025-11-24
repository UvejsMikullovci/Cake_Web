import React, { useState } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase"; // make sure your firebase is initialized
import "./CakePopup.css";

function CakePopup({ product, onClose }) {
  const [loading, setLoading] = useState(false);

  if (!product) return null;

  const handleAddToCart = async () => {
    setLoading(true);

    try {
      // Get current counter
      const counterRef = doc(db, "orderCounters", "orders");
      const counterSnap = await getDoc(counterRef);
      let orderNumber = 1;

      if (counterSnap.exists()) {
        orderNumber = counterSnap.data().count + 1;
      }

      // Save the order
      const orderId = `ORDER-${String(orderNumber).padStart(5, "0")}`;
      const orderRef = doc(db, "orders", orderId);

      await setDoc(orderRef, {
        id: orderId,
        items: [product],
        createdAt: new Date(),
        discount: 0,
        cardInfo: {} // fill with real card info if needed
      });

      // Update counter
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
        <div className="popup-left">
          <img src={product.img} alt={product.name} className="popup-img" />
        </div>

        <div className="popup-right">
          <h1 className="popup-title">{product.name}</h1>

          <h3 className="popup-subtitle">Ingredients</h3>
          <ul className="popup-list">
            <li>Flour</li>
            <li>Sugar</li>
            <li>Eggs</li>
            <li>Butter</li>
          </ul>

          <p className="popup-desc">
            A delicious, moist cake topped with smooth frosting and a rich chocolate glaze.
          </p>

          <h2 className="popup-price">${product.price}.00</h2>

          <button className="popup-btn" onClick={handleAddToCart} disabled={loading}>
            {loading ? "Adding..." : "ADD TO CART"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CakePopup;
