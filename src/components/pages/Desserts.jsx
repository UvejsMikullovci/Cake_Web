import React, { useState } from "react";
import Navbar from "../organisms/Navbar";
import Footer from "../organisms/Footer";
import birthdaycake from '../Photos/Random/birthdaycake.jpg';
import ChocolateDream from '../Photos/Random/ChocolateDream.jpg';
import VanillaDelight from '../Photos/Random/VanillaDelight.jpg';
import FunfettiParty from '../Photos/Random/FunfettiParty.jpg';
import StrawberryBliss from '../Photos/Random/StrawberryBliss.jpg';
import UnicornMagic from '../Photos/Random/UnicornMagic.jpg';
import ClassicElegance from '../Photos/Random/ClassicElegance.jpg';
import RomanticRose from '../Photos/Random/RomanticRose.jpg';
import ModernMinimalist from '../Photos/Random/ModernMinimalist.jpg';
import weddingcake from '../Photos/Random/weddingcake.jpg';
import IvoryClassic from '../Photos/Random/IvoryClassic.jpg';
import PinkLuxury from '../Photos/Random/PinkLuxury.jpg';
import ChocolateChip from '../Photos/Random/ChocolateChip.jpg';
import SugarCookies from '../Photos/Random/SugarCookies.jpg';
import AssortedCookie from '../Photos/Random/AssortedCookie.jpg';
import MacaronMix from '../Photos/Random/MacaronMix.jpg';
import ButterCookie from '../Photos/Random/ButterCookie.jpg';
import CaramelCookie from '../Photos/Random/CaramelCookie.jpg';
import PastryAssortment from '../Photos/Random/PastryAssortment.jpg';
import Tiramisu from '../Photos/Random/Tiramisu.jpg';
import Bakllava from '../Photos/Random/Bakllava.jpg';
import ClassicApplePie from '../Photos/Random/ClassicApplePie.jpg';
import Praline from '../Photos/Random/Praline.jpg';
import CherryDelight from '../Photos/Random/CherryDelight.jpg';
import "./Desserts.css";

const productsData = [
  {
    id: 1,
    category: "Birthday",
    name: "Rainbow Celebration",
    price: 55,
    img: birthdaycake,
    date: "2024-11-12",
    popularity: 98,
  },
  {
    id: 2,
    category: "Birthday",
    name: "Chocolate Dream",
    price: 48,
    img: ChocolateDream,
    date: "2024-10-02",
    popularity: 76,
  },
  {
    id: 3,
    category: "Birthday",
    name: "Vanilla Delight",
    price: 62,
    img: VanillaDelight,
    date: "2024-11-01",
    popularity: 85,
  },
  {
    id: 4,
    category: "Birthday",
    name: "Funfetti Party",
    price: 50,
    img: FunfettiParty,
    date: "2024-09-22",
    popularity: 71,
  },
  {
    id: 5,
    category: "Birthday",
    name: "Strawberry Bliss",
    price: 45,
    img: StrawberryBliss,
    date: "2024-09-01",
    popularity: 90,
  },
  {
    id: 6,
    category: "Birthday",
    name: "Unicorn Magic",
    price: 70,
    img: UnicornMagic,
    date: "2024-11-05",
    popularity: 100,
  },

  {
    id: 7,
    category: "Wedding",
    name: "Classic Elegance",
    price: 120,
    img: ClassicElegance,
    date: "2024-10-11",
    popularity: 96,
  },
  {
    id: 8,
    category: "Wedding",
    name: "Romantic Rose",
    price: 150,
    img: RomanticRose,
    date: "2024-11-03",
    popularity: 88,
  },
  {
    id: 9,
    category: "Wedding",
    name: "Modern Minimalist",
    price: 180,
    img: ModernMinimalist,
    date: "2024-09-15",
    popularity: 100,
  },
  {
    id: 10,
    category: "Wedding",
    name: "Deluxe Floral Cake",
    price: 135,
    img: weddingcake,
    date: "2024-11-11",
    popularity: 74,
  },
  {
    id: 11,
    category: "Wedding",
    name: "Ivory Classic Cake",
    price: 160,
    img: IvoryClassic,
    date: "2024-10-01",
    popularity: 81,
  },
  {
    id: 12,
    category: "Wedding",
    name: "Pink Luxury Cake",
    price: 145,
    img: PinkLuxury,
    date: "2024-11-07",
    popularity: 92,
  },

  {
    id: 13,
    category: "Cookies",
    name: "Chocolate Chip",
    price: 10,
    img: ChocolateChip,
    date: "2024-11-10",
    popularity: 93,
  },
  {
    id: 14,
    category: "Cookies",
    name: "Sugar Cookie",
    price: 8,
    img: SugarCookies,
    date: "2024-09-13",
    popularity: 70,
  },
  {
    id: 15,
    category: "Cookies",
    name: "Macaron Mix",
    price: 12,
    img: MacaronMix,
    date: "2024-11-03",
    popularity: 89,
  },
  {
    id: 16,
    category: "Cookies",
    name: "Butter Cookie",
    price: 7,
    img: ButterCookie,
    date: "2024-08-28",
    popularity: 63,
  },
  {
    id: 17,
    category: "Cookies",
    name: "Assorted Cookie Box",
    price: 9,
    img: AssortedCookie,
    date: "2024-11-09",
    popularity: 86,
  },
  {
    id: 18,
    category: "Cookies",
    name: "Caramel Cookie",
    price: 11,
    img: CaramelCookie,
    date: "2024-10-17",
    popularity: 82,
  },

  {
    id: 19,
    category: "Pies",
    name: "Classic Apple Pie",
    price: 45,
    img: ClassicApplePie,
    date: "2024-11-04",
    popularity: 98,
  },
  {
    id: 20,
    category: "Pies",
    name: "Tiramisu",
    price: 42,
    img: Tiramisu,
    date: "2024-09-26",
    popularity: 80,
  },
  {
    id: 21,
    category: "Pies",
    name: "Pastry Assortment",
    price: 40,
    img: PastryAssortment,
    date: "2024-10-15",
    popularity: 72,
  },
  {
    id: 22,
    category: "Pies",
    name: "Baklava",
    price: 47,
    img: Bakllava,
    date: "2024-11-06",
    popularity: 94,
  },
  {
    id: 23,
    category: "Pies",
    name: "Cherry Delight",
    price: 44,
    img: CherryDelight,
    date: "2024-10-02",
    popularity: 79,
  },
  {
    id: 24,
    category: "Pies",
    name: "Praline",
    price: 43,
    img: Praline,
    date: "2024-08-25",
    popularity: 67,
  },
];

function Desserts() {
<<<<<<< HEAD
  const [category, setCategory] = useState("Birthday");
  const [sortBy, setSortBy] = useState("popular");

  // --------- FILTER PRODUCTS BY CATEGORY --------- //
  const filtered = productsData.filter((p) => p.category === category);

  // --------- SORT LOGIC --------- //
  const sortedProducts = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.date) - new Date(a.date);
      case "low":
        return a.price - b.price;
      case "high":
        return b.price - a.price;
      case "popular":
        return b.popularity - a.popularity;
      default:
        return 0;
    }
  });

=======
  const cakeCard = [
    
  ]
>>>>>>> 7e227a1f8a4dee0ce7520b146980507803842917
  return (
    <div className="dessert-wrapper">
      <Navbar />

      {/* Banner */}
      <section className="banner-collection">
        <div className="collection-text">
          <h1 className="collection-title">Our Dessert Collection</h1>
          <p className="collection-description">
            From birthday cakes to wedding masterpieces, cookies to pies – discover our
            full <br /> range of handcrafted delights
          </p>
        </div>
      </section>

      {/* SORT */}
      <div className="sort-section">
        <span>Sort by:</span>
        <select className="sort-dropdown" onChange={(e) => setSortBy(e.target.value)}>
          <option value="popular">Most Popular</option>
          <option value="newest">Newest</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
        </select>
      </div>

      {/* CATEGORY FILTER BUTTONS */}
      <div className="filter-buttons">
        <button className={category === "Birthday" ? "active" : ""} onClick={() => setCategory("Birthday")}>Birthday Cakes</button>
        <button className={category === "Wedding" ? "active" : ""} onClick={() => setCategory("Wedding")}>Wedding Cakes</button>
        <button className={category === "Cookies" ? "active" : ""} onClick={() => setCategory("Cookies")}>Cookies</button>
        <button className={category === "Pies" ? "active" : ""} onClick={() => setCategory("Pies")}>Pies & Other</button>
      </div>

      {/* GRID */}
      <div className="dessert-grid">
        {sortedProducts.map((item) => (
          <div className="dessert-card" key={item.id}>
            <img src={item.img} className="dessert-img" />
            <h3 className="dessert-name">{item.name}</h3>
            <p className="dessert-price">${item.price}.00</p>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
}

export default Desserts;