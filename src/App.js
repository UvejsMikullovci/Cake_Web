import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./components/pages/Home";
import Desserts from "./components/pages/Desserts";
import CustomCakePage from "./components/pages/CustomCakes/CakePage";
import ContactFaqPage from "./components/pages/Contact";
import SignInSignUp from "./components/pages/SignInSignUp";
import Blog from "./components/pages/Blog";
import About from "./components/pages/About";
import Gallery from "./components/pages/Gallery";
import PaymentsAndCheckout from "./components/pages/PaymentsAndCheckout";
import Dashboard from "./components/pages/Dashboard/MainDashboard/MainDashboard";

import "./App.css";

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
        <Route path="/blog" element={<Blog />} />
        <Route path="/about" element={<About />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/checkout" element={<PaymentsAndCheckout />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}
