import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { BrandThemeProvider } from "./theme/BrandThemeProvider";
import Home from "./components/pages/Home/Home";
import Desserts from "./components/pages/Desserts/Desserts";
import CustomCakePage from "./components/pages/CustomCakes/CakePage";
import ContactFaqPage from "./components/pages/Contact/Contact";
import SignInSignUp from "./components/pages/SignInAndSignUp/SignInSignUp";
import Blog from "./components/pages/Blog/Blog";
import About from "./components/pages/About/About";
import Gallery from "./components/pages/Gallery/Gallery";
import PaymentsAndCheckout from "./components/pages/PaymentAndCheckout/PaymentsAndCheckout";
import Dashboard from "./components/pages/Dashboard/MainDashboard/MainDashboard";
import Favorite from "./components/pages/Favorite/Favorite";
import SingleBlog from "./components/pages/Blog/singelBlog"; // Add this import
import "./App.css";

export default function App() {
  return (
    <BrandThemeProvider>
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

          <Route path="/favorites" element={<Favorite />} />

          <Route path="/blog/:id" element={<SingleBlog />} /> {/* Add dynamic route for individual blog post */}

          <Route path="/blog/:id" element={<SingleBlog />} /> {/* Add dynamic route for individual blog post */}

        </Routes>
      </Router>
    </BrandThemeProvider>
  );
}
