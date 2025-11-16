
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home";
import "./App.css"
import CustomCakePage from "./components/pages/CustomCakes/CakePage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/cake" element={<CustomCakePage />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}