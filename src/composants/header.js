import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../photo/infoz.png';
import cartIcon from "../photo/chariot.png";
import searchIcon from "../photo/br.png";
import profileIcon from "../photo/pr.jpg"; 
import './header.css'; 
import { InputGroup, FormControl, Button } from 'react-bootstrap'; 
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"; 
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const Header = () => {
  const [user, setUser] = useState(null); 
  const [isAdmin, setIsAdmin] = useState(false); // Track if user is admin
  const [searchText, setSearchText] = useState(""); 
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Check if user is admin in Firestore
        const db = getFirestore();
        const userRef = doc(db, 'users', currentUser.uid);
  
        getDoc(userRef).then(snapshot => {
          if (snapshot.exists()) {
            const adminStatus = snapshot.data().isAdmin;
            console.log('Admin status fetched:', adminStatus); // Debug log
            setIsAdmin(adminStatus); // Set isAdmin state based on database value
          } else {
            console.log('No user data found for', currentUser.uid); // Log for missing user data
            setIsAdmin(false); // Default to false if the user doesn't exist in the DB
          }
        }).catch((error) => {
          console.error("Error fetching admin status:", error); // Catch Firebase error
          setIsAdmin(false);
        });
      } else {
        setUser(null);
        setIsAdmin(false); // Reset admin state if user logs out
      }
    });
  
    // Cleanup the listener when component unmounts
    return () => unsubscribe();
  }, [auth]);

  // Log user state for debugging
  useEffect(() => {
    console.log('Current user:', user);
    console.log('Is Admin:', isAdmin);
  }, [user, isAdmin]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/'); // Redirect after logout
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleAdminClick = () => {
    navigate('/AdminPage'); 
  };

  const handleCartClick = () => {
    if (user) {
      navigate("/panier");
    } else {
      navigate("/register");
    }
  };

  const handleSearch = () => {
    if (searchText.trim() !== "") {
      console.log("Search text:", searchText);
      navigate(`/search/${searchText}`);
    } else {
      console.log("Search text is empty!");
    }
  };

  return (
    <header className="custom-header">
      <div className="container d-flex align-items-center justify-content-between">
        <div className="logo-section">
          <Link to="/">
            <img src={logo} alt="InfoZone Logo" className="infoz-image" />
          </Link>
        </div>

        <div className="search-section d-flex">
          <InputGroup className="mb-3 search-bar">
            <FormControl
              placeholder="Search for products, brands, and more..."
              aria-label="Search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}  
              className="search-input"
            />
            <Button variant="outline-secondary" className="search-btn" onClick={handleSearch}>
              <img src={searchIcon} alt="Search" className="search-icon" />
            </Button>
          </InputGroup>
        </div>

        <div className="header-icons d-flex align-items-center">
          <div className="cart-section" onClick={handleCartClick}>
            <img
              src={cartIcon}
              alt="Cart"
              style={{ height: "50px", marginRight: "10px" }}
            />
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
                  <li className="nav-item d-flex align-items-center me-3">
                    <Button variant="outline-secondary" onClick={handleAdminClick}>
                      Admin
                    </Button>
                  </li>
                )}
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
