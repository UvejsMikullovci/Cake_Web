import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import { auth, db } from "../../firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useBrandTheme } from "../../../theme/BrandThemeProvider.jsx";

export default function Sidebar({ onSelect, active }) {
  const [role, setRole] = useState(null);
  const theme = useBrandTheme();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setRole(null);
        return;
      }

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setRole(snap.data().role);
      } else {
        setRole("customer");
      }
    });

    return () => unsub();
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        window.location.href = "/";
      })
      .catch((error) => console.error("Logout error:", error));
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        {theme.logoBase64 ? (
          <img src={theme.logoBase64} alt="Logo" className="sidebar-logo-img" />
        ) : (
          <i className="fa-solid fa-cake-candles"></i>
        )}
      </div>

      <nav className="sidebar-menu">

        <button
          className={`menu-item ${active === "profile" ? "active" : ""}`}
          onClick={() => onSelect("profile")}
        >
          <i className="fa-solid fa-user"></i>
          <span>Profile</span>
        </button>

        {/* CUSTOMER */}
        {role === "customer" && (
          <button
            className={`menu-item ${active === "orders" ? "active" : ""}`}
            onClick={() => onSelect("orders")}
          >
            <i className="fa-solid fa-clock-rotate-left"></i>
            <span>Order History</span>
          </button>
        )}

        {/* BUSINESS */}
        {role === "business" && (
          <>
            <button
              className={`menu-item ${active === "orders" ? "active" : ""}`}
              onClick={() => onSelect("orders")}
            >
              <i className="fa-solid fa-box"></i>
              <span>Orders</span>
            </button>

            <button
              className={`menu-item ${active === "desserts" ? "active" : ""}`}
              onClick={() => onSelect("desserts")}
            >
              <i className="fa-solid fa-cookie-bite"></i>
              <span>Desserts</span>
            </button>

            <button
              className={`menu-item ${active === "blog" ? "active" : ""}`}
              onClick={() => onSelect("blog")}
            >
              <i className="fa-solid fa-pen-nib"></i>
              <span>Blogs</span>
            </button>
          </>
        )}

        <button
          className={`menu-item ${active === "settings" ? "active" : ""}`}
          onClick={() => onSelect("settings")}
        >
          <i className="fa-solid fa-gear"></i>
          <span>Settings</span>
        </button>
      </nav>

      <div className="sidebar-footer">
        <button className="logout" onClick={handleLogout}>
          <i className="fa-solid fa-right-from-bracket"></i>
          Logout
        </button>
      </div>
    </aside>
  );
}