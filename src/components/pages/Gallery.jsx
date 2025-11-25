import React from "react";
import Navbar from "../organisms/Navbar";
import Footer from "../organisms/Footer";
import ppink from "../Photos/Random/ppink.jpg";
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
import Fruitcakes from '../Photos/Random/Fruitcakes.jpg'
import pies from '../Photos/Random/pies.jpg'
import cakee from '../Photos/Random/cakee.jpg'
import Artisanpastries from '../Photos/Random/Artisanpastries.jpg'
import Masonry from "react-masonry-css";
import "./Gallery.css"

export default function Gallery(){
    const images = [
    birthdaycake, 
    PinkLuxury,
    Praline,
    ClassicApplePie, 
    VanillaDelight, 
    ModernMinimalist, 
    AssortedCookie, 
    UnicornMagic, 
    cakee,
    ClassicElegance, 
    FunfettiParty,
    MacaronMix,
    Artisanpastries,
    weddingcake,
   CaramelCookie,
    Fruitcakes,
    ChocolateChip,
    SugarCookies,
    StrawberryBliss,
    ButterCookie,
     IvoryClassic,
    PastryAssortment,
    Tiramisu,
    Bakllava,
    pies,
    ChocolateDream,
     RomanticRose, 
    CherryDelight
]; 
    const breakpoints = { 
        default: 3,
        1100: 3,
        800: 2, 
        500: 1, };
    return(
        <div className="gallery-section">
            <Navbar/>
            <section className="gallery-banner">
                 <div className="gallery-text">
          <h1 className="gallery-title">Our Gallery</h1>
          <p className="gallery-description">
       A visual feast of our finest creations – from elegant wedding cakes to playful birthday treats
          </p>
        </div>
            </section>
              <svg className="svgBaner" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path
          d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
          fill="#F7C0C3"
        ></path>
      </svg>
<section className="gallery-section">
<Masonry
breakpointCols={breakpoints}
className="masonry-grid"
columnClassName="masonry-column"
>
{images.map((src, index) => (
<div key={index} className="gallery-item">
<img src={src} alt={`Gallery ${index}`} className="gallery-image" />
 
</div>
))}
</Masonry>
</section>
              
 <section className="gallery-footer">
            <Footer/>
            </section>
        </div>
    )
}