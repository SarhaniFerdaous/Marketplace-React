import React from 'react';
import { Link } from 'react-router-dom';
import profileIcon from "../photo/pr.jpg"; // Path to your profile icon
import logo from "../photo/nv.jpg"; // Path to your nv.jpg logo
import cartIcon from "../photo/chariot.png"; // Path to your chariot.png image
import searchIcon from "../photo/br.png"; // Path to your br.jpg image
import './header.css'; // Custom styles for the header
import { InputGroup, FormControl, Button } from 'react-bootstrap'; // Importing necessary components from React-Bootstrap

const Header = () => {
  return (
    <header className="custom-header">
      <div className="container d-flex align-items-center justify-content-between">
        
        {/* Logo Section - Wrapped in Link to redirect to home */}
        <div className="logo-section">
          <Link to="/"> {/* Make the logo clickable to navigate to Home */}
            <img
              src={logo} 
              alt="InfoZone Logo"
              className="nv-image"
            />
          </Link>
        </div>

        {/* Search Bar Section using React-Bootstrap */}
        <div className="search-section d-flex">
          <InputGroup className="mb-3 search-bar">
            <FormControl
              placeholder="Search for products, brands, and more..."
              aria-label="Search"
              className="search-input"
            />
            <Button variant="outline-secondary" className="search-btn">
              <img 
                src={searchIcon} 
                alt="Search" 
                className="search-icon"
              />
            </Button>
          </InputGroup>
        </div>

        {/* Profile and Cart Section */}
        <div className="header-icons d-flex align-items-center">
          {/* Cart Icon */}
          <div className="cart-section">
            <img 
              src={cartIcon} 
              alt="Cart" 
              style={{ height: '50px', marginRight: '10px' }} 
            />
          </div>

          {/* Signup Button */}
         <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex align-items-center">
           <li className="nav-item d-flex align-items-center me-3">
             <Link className="nav-link" to="/register">
               <Button
                  variant="dark"
                   style={{ backgroundColor: '#0d6efd', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px' }}
                  > Register
               </Button>
             </Link>
           </li>
         </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
