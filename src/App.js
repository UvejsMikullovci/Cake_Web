
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home";
import "./App.css"
import CustomCakePage from "./components/pages/CustomCakes/CakePage";
import ContactFaqPage from "./components/pages/Contact";
import SignInSignUp from "./components/pages/SignInSignUp";

export default function App() {
  return (
    <Router>
      <Routes>
<<<<<<< Updated upstream
        <Route path="/custom-cakes" element={<CustomCakePage />} />
=======
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
        <Route path="/cake" element={<CustomCakePage />} />
        <Route path="/contact" element={<ContactFaqPage />} />
        <Route path="/auth" element={<SignInSignUp />} />
=======
        <Route path="/custom-cakes" element={<CustomCakePage />} />
>>>>>>> 4757abde15850ed370c50c6284ed9725960045d9
=======
        <Route path="/custom-cakes" element={<CustomCakePage />} />
>>>>>>> 4757abde15850ed370c50c6284ed9725960045d9
=======
        <Route path="/custom-cakes" element={<CustomCakePage />} />
>>>>>>> 4757abde15850ed370c50c6284ed9725960045d9
>>>>>>> Stashed changes
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}