import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { useUser } from '../context/UserContext'; // Ensure correct path to UserContext

const NavBar = () => {
  const [showCategories, setShowCategories] = useState(false);
  const dropdownRef = useRef(null);
  const { userData } = useUser(); // Retrieve user data from context
  const navigate = useNavigate();
  const location = useLocation(); // Use the location hook to get the current route

  const handleToggle = () => {
    if (!userData) {
      // If the user is not signed in, navigate to the register page
      navigate('/register');
    } else {
      // If the user is signed in, toggle the categories dropdown
      setShowCategories(!showCategories);
    }
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

  useEffect(() => {
    console.log('userData:', userData); // Check if user data is being updated correctly
  }, [userData]);

  // Check if the current path is "ajouterProduits" and hide the "Ajouter Produit" button if so
  const isOnAddProductPage = location.pathname === '/ajouterProduits';

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
              <Nav.Link as={NavLink} to="/categories" onClick={handleClose}>All categories</Nav.Link>
              <Nav.Link as={NavLink} to="/pc" onClick={handleClose}>PC</Nav.Link>
              <Nav.Link as={NavLink} to="/accessories" onClick={handleClose}>Accessories</Nav.Link>
              <Nav.Link as={NavLink} to="/ChairGamer" onClick={handleClose}>Chair Gamer</Nav.Link>
            </div>
          )}
        </Nav>

        
        <div className="greeting-message">
  {userData ? (
    userData.isAdmin ? (
      // If the user is an admin
      <h1>What a surprise!</h1>
    ) : (
      // If the user is not an admin
      <h1>Happy shopping, {userData.name}!</h1>
    )
  ) : (
    <h1>Become an InfoZoner!</h1>
  )}
</div>


        {/* Conditionally Render Ajouter Produit Button */}
        {userData && !isOnAddProductPage && (
          <Button variant="primary" className="add-product-button" onClick={handleAddProductClick}>
            Sell your goods
          </Button>
        )}
      </Navbar.Collapse>

      {/* Inline CSS Styles */}
      <style jsx>{`
  .navbar {
    display: flex;
    justify-content: space-between; /* Distributes space between items */
    align-items: center; /* Aligns items vertically */
    padding-left: 1rem; /* Adjust padding as needed */
    padding-right: 1rem; /* Adjust padding as needed */
    width: 100%; /* Ensure navbar takes up full width */
    max-width: 100%;
  }

  .categories-dropdown {
  cursor: pointer;
  padding: 10px;
  font-weight: bold;
  font-size: 1.4rem;
  color: #007bff; /* Set text color to blue */
  border-radius: 5px; /* Optional: to make the button have rounded corners */
  transition: background-color 0.3s ease; /* Smooth transition for background color */
}


  .greeting-message {
    text-align: center;
    font-size: 1.2rem;
    color: #333;
    flex-grow: 1; /* Allows this element to take up remaining space */
    text-align: center; /* Keeps text centered */
  }

  .add-product-button {
    background-color: #D7D3BF; /* Set button color */
    color: black; /* Ensure text color is black */
    margin-right: 15px; /* Adjust spacing as needed */
    border: none;
    font-weight: bold;
  }

    .add-product-button:hover {
     background-color: #D7D3BF; /* Keep the same color on hover */
     color: black; /* Keep text color black on hover */
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
    color: black; /* Set text color to black */
    transition: background-color 0.2s ease;
  }

  .categories-list .nav-link:hover {
    background-color: #f0f0f0;
  }

  .me-auto {
    position: relative;
  }

  /* Add responsiveness */
  @media (max-width: 768px) {
    .navbar {
      flex-direction: column; /* Stack the navbar items on smaller screens */
      align-items: center; /* Center the items */
      padding-left: 0.5rem;
      padding-right: 0.5rem;
    }

    .categories-dropdown {
      font-size: 1.2rem; /* Smaller font size on small screens */
    }

    .categories-list {
      position: relative;
      top: 0;
      left: 0;
      box-shadow: none;
      padding: 8px;
      min-width: 120px;
    }

    .greeting-message {
      font-size: 1rem;
    }

    .add-product-button {
      margin-right: 10px; /* Adjust spacing on smaller screens */
    }
  }

  @media (max-width: 480px) {
    .categories-dropdown {
      font-size: 1rem; /* Smaller font size on very small screens */
    }

    .greeting-message {
      font-size: 0.9rem;
    }
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
