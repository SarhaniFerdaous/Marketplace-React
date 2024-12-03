import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../photo/infoz.png';
import cartIcon from "../photo/chariot.png";
import searchIcon from "../photo/br.png";
import profileIcon from "../photo/pr.jpg"; 
import { InputGroup, FormControl, Button } from 'react-bootstrap'; 
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"; 
import { BasketContext } from '../context/BasketContext'; 
import { doc, getFirestore, getDoc } from 'firebase/firestore'; 

const Header = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchText, setSearchText] = useState("");
  const { basket } = useContext(BasketContext); 
  const cartItemCount = basket.reduce((count, item) => count + item.quantity, 0); 
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore(); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
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
  }, [auth, db]); 

  const handleSearch = (e) => {
    if (e.type === "click" || e.key === "Enter") {
      if (searchText.trim()) {
        navigate(`/search?search=${encodeURIComponent(searchText.trim())}`);
      }
    }
  };

  const handleCartClick = () => {
    if (user) {
      navigate("/panier");
    } else {
      navigate("/register");
    }
  };

  return (
    <>
      <style>
        {`
          /* Header Container */
          .custom-header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background-color: #D7D3BF;
            border-bottom: 2px solid #e0e0e0;
            box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.05);
            padding: 10px 40px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            height: 80px;
            z-index: 1000;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          /* Left Section - Logo */
          .left-section {
            display: flex;
            align-items: center;
            margin-right: auto;
          }

          .infoz-image {
            height: 60px;
            width: auto;
            margin-left: -350px;
          }

          /* Center Section - Search Bar */
          .center-section {
            display: flex;
            justify-content: center;
            width: 100%;
          }

          .search-bar-container {
            display: flex;
            align-items: center;
            width: 100%;
            max-width: 900px; 
          }

          .search-input {
            flex: 1;
            border: 2px solid #e0e0e0;
            padding: 14px 20px;
            font-size: 16px;
            border-radius: 30px 0 0 30px;
            transition: border-color 0.3s ease-in-out;
          }

          .search-input:focus {
            outline: none;
            border-color: #007bff;
          }

          .search-btn {
            background: linear-gradient(90deg, #800080, #007bff);
            border: none;
            height: 45px;
            width: 45px;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: background 0.3s;
            border-radius: 0 30px 30px 0;
            margin-left: 10px;
            cursor: pointer;
          }

          .search-btn:hover {
            background: linear-gradient(90deg, #6f007d, #0056b3);
          }

          .search-icon {
            height: 22px;
            width: 22px;
          }

          .right-section {
            display: flex;
            align-items: center;
            justify-content: flex-end;
          }

          .header-icons {
            display: flex;
            align-items: center;
            gap: 20px;
          }

          .header-icons li {
            display: flex;
            align-items: center;
          }

          .icon {
            height: 30px;
            width: auto;
          }

          .cart-section img,
          .profile-section img {
            height: 50px;
            width: 50px;
            cursor: pointer;
          }

          .cart-section {
            margin-left: 20px;
          }

          .layout-container {
            margin-top: 80px;
          }

          .search-results-container {
            padding: 10px;
            background-color: #f8f9fa;
            border: 1px solid #ddd;
            border-radius: 5px;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
            position: absolute;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            width: 80%;
            max-height: 400px;
            overflow-y: scroll;
            z-index: 999;
          }

          .search-results-container ul {
            list-style-type: none;
            padding: 0;
          }

          .search-results-container li {
            padding: 10px 0;
            border-bottom: 1px solid #ddd;
          }

          .search-results-container li h4 {
            font-size: 16px;
            margin-bottom: 5px;
          }

          .search-results-container li p {
            font-size: 14px;
            color: #555;
          }

          /* Custom Logout Button Style */
          .logout-btn {
            background-color: #1A1A1D;
            color: white;
            border: none;
            transition: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
          }

          .logout-btn:hover {
            background-color: black;
            color: white;
          }
        `}
      </style>
      
      <header className="custom-header">
        <div className="container d-flex align-items-center justify-content-between">
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
                <Button variant="outline-secondary" className="search-btn" onClick={handleSearch}>
                  <img src={searchIcon} alt="Search" className="search-icon" />
                </Button>
              </InputGroup>
            </div>
          </div>
          <div className="right-section d-flex align-items-center">
            <div className="cart-section" onClick={handleCartClick}>
              <img
                src={cartIcon}
                alt="Cart"
                style={{ height: "50px", marginRight: "10px" }}
              />
              {user && cartItemCount > 0 && (
                <span className="cart-badge">{cartItemCount}</span> 
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
                        <Button variant="outline-secondary" onClick={() => navigate('/admin')}>
                          Admin dashboard
                        </Button>
                      </li>
                    </>
                  )}
                  <li className="nav-item d-flex align-items-center me-3">
                    <Button
                      variant="outline-secondary"
                      className="logout-btn"
                      onClick={() => {
                        signOut(auth);
                        navigate("/");
                      }}
                    >
                      Logout
                    </Button>
                  </li>
                </div>
              ) : (
                <li className="nav-item d-flex align-items-center">
                  <Button
                    variant="outline-primary"
                    onClick={() => navigate('/register')}
                  >
                    Register
                  </Button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
