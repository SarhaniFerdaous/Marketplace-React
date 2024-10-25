import React, { useState, useEffect } from 'react';
import { Carousel, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase.config'; 
import { onAuthStateChanged } from 'firebase/auth';
import { useUser } from '../context/UserContext'; // Ensure correct path to UserContext
import './home.css'; 

// Import product images
import pcImage1 from '../photo/pc1.png';
import pcImage2 from '../photo/pc2.png';
import pcImage3 from '../photo/pc3.png';
import ecImage1 from '../photo/ec1.png';
import ecImage2 from '../photo/ec2.png';
import ecImage3 from '../photo/ec3.png';
import offre3 from '../photo/offre3.png';
import csImage from '../photo/cs.png';

const HomePage = () => {
  const [user, setUser] = useState(null); // State to store user authentication status
  const navigate = useNavigate();
  const { userData } = useUser(); // Retrieve user data from context

  // Monitor authentication state using Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Set the authenticated user
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const productImages = [pcImage1, pcImage2, pcImage3, ecImage1, ecImage2, ecImage3];

  // Redirect to register if user is not authenticated
  const handleProductClick = () => {
    if (!user) {
      navigate('/register'); 
    }
  };

  return (
    <Container fluid>
      {/* Hero Section - Carousel */}
      <Carousel>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={require('../photo/offre.png')}
            alt="First slide"
          />
          <Carousel.Caption>
            <h3>Special Offer</h3>
            <p>Get the best deals on top products!</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={require('../photo/offre2.png')}
            alt="Second slide"
          />
          <Carousel.Caption>
            <h3>Second Product</h3>
            <p>Discounts up to 50% on accessories!</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
      
      

      {/* Product Grid Section */}
      <div className="product-grid">
        {productImages.slice(0, 3).map((image, idx) => (
          <div key={idx} className="product-card" onClick={handleProductClick}>
            <img className="product-image" src={image} alt={`Product ${idx + 1}`} />
            <div className="product-title">Product {idx + 1}</div>
            <div className="product-price">Price: $199.99</div>
          </div>
        ))}

        {/* Insert offre3 image */}
        <div className="offer-image" onClick={handleProductClick}>
          <img src={offre3} alt="Offer 3" />
        </div>

        {/* New CS Image Offer */}
        <div className="offer-image" onClick={handleProductClick}>
          <img src={csImage} alt="Offer CS" />
        </div>

        {productImages.slice(3).map((image, idx) => (
          <div key={idx + 3} className="product-card" onClick={handleProductClick}>
            <img className="product-image" src={image} alt={`Product ${idx + 4}`} />
            <div className="product-title">Product {idx + 4}</div>
            <div className="product-price">Price: $199.99</div>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default HomePage;
