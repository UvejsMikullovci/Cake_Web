import React from "react";
import "./Sidebar.css";

export default function Sidebar({ onSelect, active }) {
  return (
    <aside className="sidebar">

      <div className="sidebar-logo">
        <i className="fa-solid fa-cake-candles"></i>
        <span>CakeCrush</span>
      </div>

      <nav className="sidebar-menu">

        <button
          className={`menu-item ${active === "profile" ? "active" : ""}`}
          onClick={() => onSelect("profile")}
        >
          <i className="fa-solid fa-user"></i>
          <span>Profile</span>
        </button>

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

        <button
          className={`menu-item ${active === "settings" ? "active" : ""}`}
          onClick={() => onSelect("settings")}
        >
          <i className="fa-solid fa-gear"></i>
          <span>Settings</span>
        </button>

      </nav>

      <div className="sidebar-footer">
        <button className="logout">
          <i className="fa-solid fa-right-from-bracket"></i>
          Logout
        </button>
      </div>

    </aside>
  );
}