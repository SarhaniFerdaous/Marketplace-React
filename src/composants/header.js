import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../photo/nv.jpg"; // Path to your nv.jpg logo
import cartIcon from "../photo/chariot.png"; // Path to your chariot.png image
import searchIcon from "../photo/br.png"; // Path to your br.jpg image
import './header.css'; // Custom styles for the header
import { InputGroup, FormControl, Button } from 'react-bootstrap'; // Importing necessary components from React-Bootstrap
import { auth } from '../firebase.config';
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

  // Redirect to register if user is not authenticated
  const handleAction = () => {
    if (!user) {
      navigate('/register'); // Redirect to the registration page
    }
  };

  return (
    <header className="custom-header">
      <div className="container d-flex align-items-center justify-content-between">
        
        {/* Logo Section - Wrapped in Link to redirect to home */}
        <div className="logo-section">
          <Link to="/">
            <img src={logo} alt="InfoZone Logo" className="nv-image" />
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
            <Button variant="outline-secondary" className="search-btn" onClick={handleAction}>
              <img src={searchIcon} alt="Search" className="search-icon" />
            </Button>
          </InputGroup>
        </div>

        {/* Profile and Cart Section */}
        <div className="header-icons d-flex align-items-center">
          {/* Cart Icon */}
          <div className="cart-section" onClick={handleAction}>
            <img src={cartIcon} alt="Cart" style={{ height: '50px', marginRight: '10px' }} />
          </div>

          {/* Conditional rendering of Register or Logout button */}
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex align-items-center">
            {user ? (
              // Display Logout button if user is logged in
              <li className="nav-item d-flex align-items-center me-3">
                <Button
                  variant="dark"
                  onClick={handleLogout}
                  style={{
                    backgroundColor: '#dc3545',
                    color: '#fff',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '5px',
                  }}
                >
                  Logout
                </Button>
              </li>
            ) : (
              // Display Register button if user is not logged in
              <li className="nav-item d-flex align-items-center me-3">
                <Link className="nav-link" to="/register">
                  <Button
                    variant="dark"
                    style={{
                      backgroundColor: '#0d6efd',
                      color: '#fff',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '5px',
                    }}
                  >
                    Register
                  </Button>
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
