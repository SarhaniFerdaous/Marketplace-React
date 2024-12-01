import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../photo/infoz.png';
import cartIcon from "../photo/chariot.png";
import searchIcon from "../photo/br.png";
import profileIcon from "../photo/pr.jpg"; 
import './header.css'; 
import { InputGroup, FormControl, Button } from 'react-bootstrap'; 
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"; 
import { BasketContext } from '../context/BasketContext'; // Import the BasketContext
import { doc, getFirestore, getDoc } from 'firebase/firestore'; // Ensure correct imports

const Header = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchText, setSearchText] = useState("");
  const { basket, clearBasket } = useContext(BasketContext); // Access the basket and clearBasket from context
  const cartItemCount = basket.reduce((count, item) => count + item.quantity, 0); // Calculate total cart items
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore(); // Initialize Firestore correctly

  // Effect to check auth state and fetch user info
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Check if the user is an admin
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnapshot = await getDoc(userRef);
        if (userSnapshot.exists()) {
          setIsAdmin(userSnapshot.data().isAdmin);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, [auth, db]); // Added db as a dependency

  return (
    <header className="custom-header">
      <div className="container d-flex align-items-center justify-content-between">
        {/* Left Section - Logo and Search Bar */}
        <div className="left-section d-flex align-items-center flex-grow-1">
          <div className="logo-section">
            <Link to="/">
              <img src={logo} alt="InfoZone Logo" className="infoz-image" />
            </Link>
          </div>
          <div className="search-section d-flex flex-grow-1">
            <InputGroup className="mb-3 search-bar w-100">
              <FormControl
                placeholder="Search for products, brands, and more..."
                aria-label="Search"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}  
                className="search-input"
              />
              <Button variant="outline-secondary" className="search-btn">
                <img src={searchIcon} alt="Search" className="search-icon" />
              </Button>
            </InputGroup>
          </div>
        </div>
        {/* Right Section - Cart, Profile, Admin, Dashboard, and Logout */}
        <div className="right-section d-flex align-items-center">
          <div className="cart-section" onClick={() => user ? navigate("/panier") : navigate("/register")}>
            <img
              src={cartIcon}
              alt="Cart"
              style={{ height: "50px", marginRight: "10px" }}
            />
            {user && cartItemCount > 0 && (
             <span className="cart-badge">{cartItemCount}</span> // Show basket count only if user is authenticated
                )}
          </div>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex align-items-center">
            {user ? (
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
                    onClick={() => navigate('/profile')}
                  />
                </li>
                {isAdmin && (
                  <>
                    <li className="nav-item d-flex align-items-center me-3">
                      <Button variant="outline-secondary" onClick={() => navigate('/AdminPage')}>
                        Admin
                      </Button>
                    </li>
                    <li className="nav-item d-flex align-items-center me-3">
                      <Button variant="outline-secondary" onClick={() => navigate('/Dashboard')}>
                        Dashboard
                      </Button>
                    </li>
                  </>
                )}
                <li className="nav-item logout-btn">
                  <Button
                    variant="dark"
                    onClick={async () => {
                      await signOut(auth); // Sign out the user
                      clearBasket(); // Clear the basket
                      navigate('/'); // Navigate to the home page
                    }}
                    style={{
                      backgroundColor: '#dc3545',
                      color: '#fff',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '5px',
                      marginLeft: '10px',
                    }}
                  >
                    Logout
                  </Button>
                </li>
              </div>
            ) : (
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
