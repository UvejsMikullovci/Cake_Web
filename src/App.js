import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home";
import Desserts from "./components/pages/Desserts";
import "./App.css";
import CustomCakePage from "./components/pages/CustomCakes/CakePage";
import ContactFaqPage from "./components/pages/Contact";
import SignInSignUp from "./components/pages/SignInSignUp";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/cake" element={<CustomCakePage />} />
        <Route path="/custom-cakes" element={<CustomCakePage />} />
        <Route path="/contact" element={<ContactFaqPage />} />
        <Route path="/auth" element={<SignInSignUp />} />
        <Route path="/" element={<Home />} />
        <Route path="/desserts" element={<Desserts />} />
      </Routes>
    </Router>
  );
}
