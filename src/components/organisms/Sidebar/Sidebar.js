import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import { auth, db } from "../../firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function Sidebar({ onSelect, active }) {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const fetchRole = async () => {
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) setRole(snap.data().role);
    };

    fetchRole();
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        window.location.href = "/";
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <i className="fa-solid fa-cake-candles"></i>
        <span>CakeCrush</span>
      </div>

      <nav className="sidebar-menu">

        {/* Always visible */}
        <button
          className={`menu-item ${active === "profile" ? "active" : ""}`}
          onClick={() => onSelect("profile")}
        >
          <i className="fa-solid fa-user"></i>
          <span>Profile</span>
        </button>

        {/* CUSTOMER: "Order History" */}
        {role === "customer" && (
          <button
            className={`menu-item ${active === "orders" ? "active" : ""}`}
            onClick={() => onSelect("orders")}
          >
            <i className="fa-solid fa-clock-rotate-left"></i>
            <span>Order History</span>
          </button>
        )}

        {/* BUSINESS: Original Orders */}
        {role === "business" && (
          <button
            className={`menu-item ${active === "orders" ? "active" : ""}`}
            onClick={() => onSelect("orders")}
          >
            <i className="fa-solid fa-box"></i>
            <span>Orders</span>
          </button>
        )}

        {/* BUSINESS ONLY */}
        {role === "business" && (
          <>
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

        {/* Always visible */}
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