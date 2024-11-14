import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Carousel, Container } from 'react-bootstrap';
import { auth } from '../api/firebase.config';
import { onAuthStateChanged } from 'firebase/auth';
import { useUser } from '../context/UserContext'; // Ensure correct path to UserContext
import './home.css';

// Import images
import pcImage1 from '../photo/pc.jpg';
import ecImage1 from '../photo/ec.jpg';
import ecImage3 from '../photo/ch.jpg';
import offre from '../photo/offre.png';
import offre1 from '../photo/offre1.png';

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

  const productLinks = [
    { image: pcImage1, title: 'PC', path: '/pc' },
    { image: ecImage1, title: 'Ecran', path: '/ecran' },
    { image: ecImage3, title: 'Chair Gamer', path: '/ChairGamer' },
  ];

  const handleProductClick = (path) => {
    if (!user) {
      navigate('/register'); // Redirect to register page if not authenticated
    } else {
      navigate(path); // Navigate to the product page
    }
  };

  return (
    <Container fluid>
      <Carousel>
        <Carousel.Item>
          <img className="d-block w-100" src={offre} alt="First slide" />
        </Carousel.Item>
        <Carousel.Item>
          <img className="d-block w-100" src={offre1} alt="Second slide" />
        </Carousel.Item>
      </Carousel>

      <div className="product-grid">
        {productLinks.map((product, idx) => (
          <div key={idx} className="product-card" onClick={() => handleProductClick(product.path)}>
            <img className="product-image" src={product.image} alt={product.title} />
            <div className="product-title">{product.title}</div>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default HomePage;
