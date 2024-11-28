import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../photo/infoz.png';
import cartIcon from "../photo/chariot.png";
import searchIcon from "../photo/br.png";
import profileIcon from "../photo/pr.jpg"; 
import './header.css'; 
import { InputGroup, FormControl, Button } from 'react-bootstrap'; 
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"; 
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore'; // Updated imports for querying products

const Header = () => {
  const [user, setUser] = useState(null); 
  const [isAdmin, setIsAdmin] = useState(false); // Track if user is admin
  const [searchText, setSearchText] = useState(""); 
  const [searchResults, setSearchResults] = useState([]); // New state for search results
  const navigate = useNavigate();
  const auth = getAuth();
  
  // Effect to check auth state and fetch user info (admin status)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const db = getFirestore();
        const userRef = doc(db, 'users', currentUser.uid); // Now doc is defined
        getDoc(userRef).then(snapshot => { // Now getDoc is defined
          if (snapshot.exists()) {
            setIsAdmin(snapshot.data().isAdmin);
          } else {
            setIsAdmin(false);
          }
        });
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    });
  
    return () => unsubscribe();
  }, [auth]);
  

  // Function to handle search
  const handleSearch = async () => {
    if (searchText.trim() !== "") {
      console.log("Search text:", searchText);
      const db = getFirestore();
      const productsRef = collection(db, "products");
      const q = query(productsRef, where("name", ">=", searchText), where("name", "<=", searchText + "\uf8ff"));
      
      try {
        const querySnapshot = await getDocs(q);
        const results = querySnapshot.docs.map(doc => doc.data());
        setSearchResults(results);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    } else {
      setSearchResults([]); // Reset results if search text is empty
    }
  };

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
              <Button variant="outline-secondary" className="search-btn" onClick={handleSearch}>
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
                      await signOut(auth);
                      navigate('/');
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

      {/* Display search results */}
      {searchResults.length > 0 && (
        <div className="search-results">
          <h3>Search Results</h3>
          <ul>
            {searchResults.map((product, index) => (
              <li key={index}>
                <h4>{product.name}</h4>
                <p>{product.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
