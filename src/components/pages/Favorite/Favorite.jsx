import React, { useEffect, useState } from "react";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { getAuth } from "firebase/auth";
import "./Favorite.css";
import Navbar from "../../organisms/NavBar/Navbar";
import Footer from "../../organisms/Footer/Footer";

export default function Favorite() {
  const [favorites, setFavorites] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;
    const favRef = collection(db, "users", user.uid, "favorites");
    const unsub = onSnapshot(favRef, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setFavorites(list);
    });

    return () => unsub();
  }, [user]);

  const removeFavorite = async (id) => {
    if (!user) return;
    await deleteDoc(doc(db, "users", user.uid, "favorites", id));
  };

  return (
    <div className="favorites-wrapper">
      <Navbar />
      <h1 className="fav-title">Your Favorites</h1>

      <div className="fav-grid">
        {favorites.length === 0 && (
          <p className="no-favorites">No favorites yet ❤️</p>
        )}

        {favorites.map((item) => (
          <div className="fav-card" key={item.id}>
            <div className="fav-img-box">
              <img src={item.img} alt={item.name} />
            </div>

            <div className="fav-info">
              <h2 className="fav-item-title">{item.name}</h2>

              <h3 className="ingredients-title">Ingredients</h3>
              <ul className="ingredients-list">
                {item.ingredients?.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>

              <p className="fav-desc">{item.description}</p>

              <p className="fav-price">€{item.price}</p>
              <div className="buttons">
                <button className="add-btn">ADD TO CART</button>
                <button
                  className="remove-btn"
                  onClick={() => removeFavorite(item.id)}
                >
                  REMOVE
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}
