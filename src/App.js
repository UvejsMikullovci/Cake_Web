import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home";
import Desserts from "./components/pages/Desserts";
import "./App.css";
import CustomCakePage from "./components/pages/CustomCakes/CakePage";
import ContactFaqPage from "./components/pages/Contact";
import SignInSignUp from "./components/pages/SignInSignUp";
import Blog from "./components/pages/Blog";
import About from "./components/pages/About";
<<<<<<< HEAD
import Gallery from "./components/pages/Gallery";
=======
import PaymentsAndCheckout from "./components/pages/PaymentsAndCheckout";
>>>>>>> 6facb57b7cbe33c31b80816ad1867a230edd5c4f

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
<<<<<<< HEAD
        <Route path="/gallery" element={<Gallery/>} />
=======
        <Route path="/checkout" element={<PaymentsAndCheckout />} />
>>>>>>> 6facb57b7cbe33c31b80816ad1867a230edd5c4f
      </Routes>
    </Router>
  );
}
