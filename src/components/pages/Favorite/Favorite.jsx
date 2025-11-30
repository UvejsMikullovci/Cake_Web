import React, { useEffect, useState } from "react";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { getAuth } from "firebase/auth";
import "./Favorite.css";
import Navbar from "../../organisms/NavBar/Navbar";
import Footer from "../../organisms/Footer/Footer";

export default function Favorite() {
  const [favorites, setFavorites] = useState([]);
  const [searchText, setSearchText] = useState("");
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

  // Filter favorites based on search
  const filteredFavorites = favorites.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="favorites-wrapper">
      <Navbar />

      <div className="fav-banner">
        <h1 className="fav-title">Your Favorites</h1>

        {/* Search bar */}
        <div className="fav-search">
          <input
            type="text"
            placeholder="Search favorites…"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>

      <div className="fav-grid">
        {filteredFavorites.length === 0 && (
          <p className="no-favorites">No favorites found ❤️</p>
        )}

        {filteredFavorites.map((item) => (
          <div className="fav-card" key={item.id}>
            <div className="fav-img-wrapper">
              <img src={item.img} alt={item.name} className="fav-img" />
            </div>

            <div className="fav-card-body">
              <h2 className="fav-name">{item.name}</h2>

              <h3 className="fav-ingredients-title">Ingredients</h3>
              <ul className="fav-ingredients-list">
                {item.ingredients?.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>

              <p className="fav-description">{item.description}</p>

              <div className="fav-price-row">
                <span className="fav-price">€{item.price}</span>
                <div className="fav-buttons">
                  <button className="fav-add-btn">ADD TO CART</button>
                  <button
                    className="fav-remove-btn"
                    onClick={() => removeFavorite(item.id)}
                  >
                    REMOVE
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
}
