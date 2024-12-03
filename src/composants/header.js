import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../photo/infoz.png';
import searchIcon from "../photo/br.png";
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
      if (user) {
        if (searchText.trim()) {
          navigate(`/search?search=${encodeURIComponent(searchText.trim())}`);
          setSearchText(""); // Clear the search input after navigating
        }
      } else {
        navigate("/register");
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

    .infoz-image {
      height: 60px;
      width: auto;
      margin-left: -350px;
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
      padding: 10px 20px; /* Adjusted for consistent size */
      font-size: 16px;
      border-radius: 30px 0 0 30px;
      height: 45px; /* Same height as the button */
      transition: border-color 0.3s ease-in-out;
    }

    .search-input:focus {
      outline: none;
      border-color: #007bff;
    }

    .search-btn {
      background: black;
      border: none;
      height: 45px; /* Match the height of the search input */
      width: 45px;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: background 0.3s;
      border-radius: 0 30px 30px 0;
      cursor: pointer;
    }

    .search-icon {
      height: 22px;
      width: 22px;
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

    .cart-section {
      margin-left: 20px;
    }

    .layout-container {
      margin-top: 80px;
    }

    .custom-button {
      color: black;
      font-weight: bold;
      background-color: transparent;
      border: none;
      text-decoration: none;
    }
  `}
</style>

      
      <header className="custom-header">
        <div className="container d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center flex-grow-1">
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
          <div className="d-flex align-items-center">
            <div className="cart-section" onClick={handleCartClick} style={{ position: "relative" }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="#1A1A1D"
                className="bi bi-cart"
                viewBox="0 0 16 16"
              >
                <path d="M0 1.5A.5.5 0 0 1 .5 1h1.11l.401 2.005L4.601 5.5H12.5a.5.5 0 0 1 .491.592l-1 5A.5.5 0 0 1 11.5 11H4a.5.5 0 0 1-.491-.408L1.61 2H.5a.5.5 0 0 1-.5-.5zm3.14 3h7.691l.88 4.5H4.02L3.14 4.5z" />
                <path d="M4.5 12a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm8 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
              </svg>
              {user && cartItemCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-5px",
                    right: "-5px",
                    backgroundColor: "#1A1A1D",
                    color: "white",
                    borderRadius: "50%",
                    padding: "5px 8px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    lineHeight: 1,
                  }}
                >
                  {cartItemCount}
                </span>
              )}
            </div>

            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex align-items-center">
              {user ? (
                <div className="d-flex align-items-center">
                  <li className="nav-item d-flex align-items-center me-3">
                    <Button
                      variant="link" // This ensures no background and the text is black
                      className="custom-button"
                      onClick={() => navigate('/profile')} // You can change the route accordingly
                    >
                      My Products
                    </Button>
                  </li>
                  {isAdmin && (
                    <>
                      <li className="nav-item d-flex align-items-center me-3">
                        <Button
                          variant="outline-secondary"
                          className="custom-button"
                          onClick={() => navigate('/AdminPage')}
                        >
                          Admin
                        </Button>
                      </li>
                      <li className="nav-item d-flex align-items-center me-3">
                        <Button
                          variant="outline-secondary"
                          className="custom-button"
                          onClick={() => navigate('/dashboard')}
                        >
                          Statistics
                        </Button>
                      </li>
                    </>
                  )}
                  <li className="nav-item d-flex align-items-center me-3">
                    <Button
                      variant="outline-secondary"
                      className="custom-button"
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
                <li className="nav-item align-items-center">
                  <Button
                    className="custom-button"
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
