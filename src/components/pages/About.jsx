import "./About.css";
import Navbar from "../organisms/Navbar";
import Footer from "../organisms/Footer";
import ppink from "../Photos/Random/ppink.jpg";
import aboutimg from "../Photos/Random/aboutimg.jpg";
import amauary from "../Photos/Random/amaury.jpg";
import emma from "../Photos/Random/emma.jpg";
import sarahjohnson from "../Photos/Random/sarahjohnson.jpg"
import { FaRegHeart } from "react-icons/fa6";
import { PiMedal } from "react-icons/pi";
import { GoPeople } from "react-icons/go";
import React, { useState, useEffect } from "react";

export default function About(){
    
        const Counter = ({ end, duration = 2000 }) => {
      const [count, setCount] = useState(0);
    
      useEffect(() => {
        let start = 0;
        const increment = end / (duration / 10); 
        const timer = setInterval(() => {
          start += increment;
          if (start >= end) {
            start = end;
            clearInterval(timer);
          }
          setCount(Math.floor(start));
        }, 10);
    
        return () => clearInterval(timer);
      }, [end, duration]);
    
      return <h3>{count}+</h3>;
    };
    const cards = [
    {
    icon: <FaRegHeart size={30} strokeWidth={1.5} />,
    title: "Quality Ingredients",
    text: "We use only the finest, freshest ingredients. No preservatives, no shortcuts – just pure, quality baking at its best.",
    },
    {
    icon: <PiMedal size={30} strokeWidth={1.5} />,
    title: "Handmade with Care",
    text: "Every cake, cookie, and pastry is crafted by hand with meticulous attention to detail. We take pride in our artisanal approach.",
    },
    {
    icon: <GoPeople size={30} strokeWidth={1.5} />,
    title: "Affordable for All",
    text: "Great cakes shouldn't break the bank. We believe everyone deserves to celebrate with delicious, beautiful desserts.",
    },
    ];
    const team = [
{
name: "Sarah Johnson",
role: "Head Baker & Founder",
img: sarahjohnson,
},
{
name: "Mike Chen",
role: "Pastry Chef",
img: amauary,
},
{
name: "Emma Davis",
role: "Cake Decorator",
img: emma,
},
];
    return(
        <div className="about-wrapper">
            <Navbar/>
                <section className="about-banner">
        <div className="about-text">
          <h1 className="about-title">About CakeCrush Bakery</h1>
          <p className="about-description">
       A story of passion, quality, and sweet moments since 2015
          </p>
        </div>
      </section>
       <div className="aboutwave"><img src={ppink} className="abouttwave"></img></div>
       <section className="aboutus-section">
        <div className="about-text">
            <h1 className="about-title">Our Story</h1>
            <p className="about-p">CakeCrush Bakery started in 2015 with a simple dream: to bring joy to people's lives through<br></br> 
            exceptional cakes and pastries. What began as a small home kitchen operation has grown into a<br></br> 
            beloved community bakery.<br></br>
            <br></br>
            Our founder, Sarah Johnson, grew up watching her grandmother bake. Those childhood memories of<br>
            </br> flour-dusted counters and the sweet smell of vanilla inspired her to share that same warmth<br>
            </br> and comfort with others.<br></br>
            <br></br>
            Today, we're proud to serve our community with handcrafted cakes, cookies, and pastries made from <br>
            </br>scratch daily. Every creation is made with love, quality ingredients, and attention to detail.
            </p>
        </div>
        <div className="about-img">
            <img src={aboutimg} className="aboutimg"></img>
            <div className="years">
                <Counter end={10} />
        <p>Years of Excellence</p>
            </div>
        </div>
       </section>
       <section className="ourvalues-section">
        <div className="ourvalues">
            <h1 className="ourvalues-title">Our Values</h1>
            <p  className="ourvalues-p">What makes CakeCrush special</p>

            <div className="ourvalues-flex">
                {cards.map((c, i) =>(
                   <div key={i} className="ourvalues-card">
                   <div className="ourvalue-icon">{c.icon}</div>
                   <h2 className="ourvalue-card-title">{c.title}</h2>
                   <p className="ourvalue-card-text">{c.text}</p>
                    </div>

                ))}
            </div>
        </div>
       </section>
       <section className="team-section">
<h2 className="title">Meet Our Team</h2>
<p className="subtitle">The talented bakers behind your favorite treats</p>


<div className="team-grid">
{team.map((member, index) => (
<div key={index} className="team-card">
<img src={member.img} alt={member.name} className="team-image" />
<h3 className="team-name">{member.name}</h3>
<p className="team-role">{member.role}</p>
</div>
))}
</div>
</section>
<section className="visit-section">
    <div className="visit-banner">
        <h1 className="visit-title">Visit Us Today!
</h1>
<p className="visit-title2">Come taste the difference that passion and quality make. We can't wait to serve you!</p>
<p className="street-p">!
📍 123 Sweet Street, Bakery Town, BT 12345
</p>
<p className="number-p">📞 (555) 123-4567</p>
<p className="hours-p">🕐 Mon-Sat: 7am - 8pm | Sun: 8am - 6pm</p>
    </div>
</section>
       <section className="about-footer">
            <Footer/>
            </section>
        </div>
    );
};