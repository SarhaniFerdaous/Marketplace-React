import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import { useUser } from '../context/UserContext'; // Ensure correct path to UserContext

// NavBar Component
const NavBar = () => {
  const [showCategories, setShowCategories] = useState(false);
  const dropdownRef = useRef(null);
  const { userData } = useUser(); // Retrieve user data from context

  const handleToggle = () => {
    setShowCategories(!showCategories);
  };

  const handleClose = () => {
    setShowCategories(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCategories(false);
      }
    };

    const handleScroll = () => {
      setShowCategories(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <div className="categories-dropdown" onClick={handleToggle} style={navLinkStyle}>
            Categories
          </div>
          {showCategories && (
            <div className="categories-list" ref={dropdownRef}>
              <Nav.Link as={NavLink} to="/pcs" onClick={handleClose}>PC</Nav.Link>
              <Nav.Link as={NavLink} to="/ordinateurs" onClick={handleClose}>Ordinateurs</Nav.Link>
              <Nav.Link as={NavLink} to="/accessoires" onClick={handleClose}>Accessoires</Nav.Link>
            </div>
          )}
               {/* Greeting Message */}
      <div className="greeting-message">
        {userData ? (
          <h1>Hello, {userData.name}!</h1> // Display user's name
        ) : (
          <h1>Welcome to the Home Page!</h1>
        )}
      </div>
        </Nav>
        
      </Navbar.Collapse>

      {/* Inline CSS Styles */}
      <style jsx>{`
        .categories-dropdown {
          cursor: pointer;
          position: relative;
          padding: 10px;
          font-weight: bold;
          font-size: 1.4rem;
          color: #007bff;
        }
        
        .greeting-message {
          margin-left: 20px; /* Space between categories and greeting */
          font-size: 1.2rem; /* Adjust font size as needed */
          color: #333; /* Darker text color for readability */
        }

        .categories-list {
          position: absolute;
          top: 100%;
          left: 0;
          background: white;
          border: 1px solid #ddd;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
          margin-top: 5px;
          padding: 10px;
          display: flex;
          flex-direction: column;
          min-width: 150px;
          transition: opacity 0.3s ease, transform 0.3s ease; /* Smooth transitions */
          z-index: 1000;
        }

        .categories-list .nav-link {
          padding: 8px 15px; /* Increased padding for better clickability */
          font-size: 1rem;
          color: #333; /* Darker text color for readability */
          transition: background-color 0.2s ease; /* Smooth background transition */
        }

        .categories-list .nav-link:hover {
          background-color: #f0f0f0; /* Light gray background on hover */
        }

        .me-auto {
          position: relative;
        }
      `}</style>
    </Navbar>
  );
};

const navLinkStyle = {
  marginRight: '-80px',
  marginLeft: '110px',
};  

export default NavBar;
