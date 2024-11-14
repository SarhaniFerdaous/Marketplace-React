import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../photo/infoz.jpg';
import cartIcon from "../photo/chariot.png"; // Path to your chariot.png image
import searchIcon from "../photo/br.png"; // Path to your br.jpg image
import profileIcon from "../photo/pr.jpg"; // Path to your pr.jpg image
import './header.css'; // Custom styles for the header
import { InputGroup, FormControl, Button } from 'react-bootstrap'; // Importing necessary components from React-Bootstrap
import { auth } from '../api/firebase.config';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const Header = () => {
  const [user, setUser] = useState(null); // Track the user's auth status
  const navigate = useNavigate();

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Set the current user
    });

    return () => unsubscribe(); // Clean up on unmount
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('Logged out successfully');
      navigate('/'); // Redirect to the home page after logout
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="custom-header">
      <div className="container d-flex align-items-center justify-content-between">
        
        {/* Logo Section - Wrapped in Link to redirect to home */}
        <div className="logo-section">
          <Link to="/">
            <img src={logo} alt="InfoZone Logo" className="infoz-image" />
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
              <img src={searchIcon} alt="Search" className="search-icon" />
            </Button>
          </InputGroup>
        </div>

        {/* Profile and Cart Section */}
        <div className="header-icons d-flex align-items-center">
          {/* Cart Icon */}
          <div className="cart-section" onClick={() => navigate('/panier')}>
            <img src={cartIcon} alt="Cart" style={{ height: '50px', marginRight: '10px' }} />
          </div>

          {/* Conditional rendering of Profile or Logout */}
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex align-items-center">
            {user ? (
              // Display Profile Icon and Logout Button side by side if user is logged in
              <div className="d-flex align-items-center">
                <li className="nav-item d-flex align-items-center me-3">
                  <img
                    src={profileIcon}
                    alt="Profile Icon"
                    style={{
                      height: '50px',
                      width: '50px',
                      borderRadius: '50%',
                      cursor: 'pointer',
                    }}
                    onClick={() => navigate('/profile')} // Optionally add navigation to profile page
                  />
                </li>
                <li className="nav-item logout-btn">
                  <Button
                    variant="dark"
                    onClick={handleLogout}
                    style={{
                      backgroundColor: '#dc3545',
                      color: '#fff',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '5px',
                      marginLeft: '10px', // Add margin to space out the buttons
                    }}
                  >
                    Logout
                  </Button>
                </li>
              </div>
            ) : (
              // Display profile icon (pr.jpg) if user is not logged in
              <li className="nav-item d-flex align-items-center me-3">
                <Link to="/register">
                  <img
                    src={profileIcon}
                    alt="Profile Icon"
                    style={{
                      height: '50px',
                      width: '50px',
                      borderRadius: '50%',
                      cursor: 'pointer',
                    }}
                  />
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
