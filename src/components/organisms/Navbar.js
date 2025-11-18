import { NavLink } from "react-router-dom";
import { FiHeart, FiUser, FiShoppingCart,} from "react-icons/fi";
import logo from '../Photos/Logos/logo.jpg';
import "./Navbar.css"

export default function Navbar (){
    return(
        <nav className="navbar">
                <div className="logo">
                    <img src={logo} alt="logo" className="logo-img" />
                </div>
        
                <div className="nav-links">
                  <NavLink to="/">Home</NavLink>
                  <NavLink to="/desserts">Desserts</NavLink>
                  <NavLink to="/custom-cakes">Custom Cakes</NavLink>
                  <NavLink to="/about">About</NavLink>
                  <NavLink to="/gallery">Gallery</NavLink>
                  <NavLink to="/blog">Blog</NavLink>
                  <NavLink to="/contact">Contact</NavLink>
                </div>
        
                 <div className="nav-icon-button">
                <div className="nav-icons">
                  <FiHeart className="icon" />
                  <FiShoppingCart className="icon" />
                  <FiUser className="icon" />
                   
                </div>
                <button className="dashboard-btn">Dashboard</button>
               </div>
              </nav>
    )
}