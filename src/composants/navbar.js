import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { useUser } from '../context/UserContext'; // Ensure correct path to UserContext

// NavBar Component
const NavBar = () => {
  const [showCategories, setShowCategories] = useState(false);
  const dropdownRef = useRef(null);
  const { userData } = useUser(); // Retrieve user data from context
  const navigate = useNavigate();

  const handleToggle = () => {
    setShowCategories(!showCategories);
  };

  const handleClose = () => {
    setShowCategories(false);
  };

  const handleAddProductClick = () => {
    navigate('/ajouterProduits'); // Updated route
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
              <Nav.Link as={NavLink} to="/pc" onClick={handleClose}>PC</Nav.Link>
              <Nav.Link as={NavLink} to="/ecran" onClick={handleClose}>Ecran</Nav.Link>
              <Nav.Link as={NavLink} to="/chair gamer" onClick={handleClose}>Chair Gamer</Nav.Link>
            </div>
          )}
        </Nav>

        {/* Centered Greeting Message */}
        <div className="greeting-message">
          {userData ? (
            <h1>Hello, {userData.name}!</h1> // Display user's name
          ) : (
            <h1>Welcome to the Home Page!</h1>
          )}
        </div>

        {/* Conditionally Render Ajouter Produit Button */}
        {userData && (
          <Button variant="primary" className="add-product-button" onClick={handleAddProductClick}>
            Ajouter Produit
          </Button>
        )}
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
          flex: 1;
          text-align: center;
          font-size: 1.2rem;
          color: #333;
        }

        .add-product-button {
          margin-right: 15px; /* Adjust spacing as needed */
        }

        .categories-list {
          position: absolute;
          top: 100%;
          left: 0;
          background: white;
          border: 1px solid #ddd;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          margin-top: 5px;
          padding: 10px;
          display: flex;
          flex-direction: column;
          min-width: 150px;
          transition: opacity 0.3s ease, transform 0.3s ease;
          z-index: 1000;
        }

        .categories-list .nav-link {
          padding: 8px 15px;
          font-size: 1rem;
          color: #333;
          transition: background-color 0.2s ease;
        }

        .categories-list .nav-link:hover {
          background-color: #f0f0f0;
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
