import React from "react";
import Navbar from "../organisms/Navbar";
import Footer from "../organisms/Footer"; 
import "./Desserts.css";

function Desserts() {
  const cakeCard = [
    
  ]
  return (
    <div className="dessert-wraper">
      <Navbar />

      <section className="banner-collection">
        <div className="collection-text">
          <h1 className="collection-title">
           Our Dessert Collection
          </h1>

          <p className="collection-description">
           From birthday cakes to wedding masterpieces, cookies to pies – discover our full<br></br> range of handcrafted delights
          </p>
        </div>
      </section>
      <section className="footer-section">
      <Footer/>
      </section>
    </div>
  );
}

export default Desserts;