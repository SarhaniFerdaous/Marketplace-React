import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Carousel, Container } from 'react-bootstrap';
import { auth } from '../api/firebase.config';
import { onAuthStateChanged } from 'firebase/auth';
import { useUser } from '../context/UserContext'; 
import './home.css';

// Import images
import pcImage1 from '../photo/pc.jpg';
import access from '../photo/access.png';
import ecImage3 from '../photo/ch.jpg';
import slider1 from '../photo/slider1.jpg';
import slider2 from '../photo/slider2.jpg';
import slider3 from '../photo/slider3.jpg';

const HomePage = () => {
  const [user, setUser] = useState(null); 
  const navigate = useNavigate();

  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); 
    });

   
    return () => unsubscribe();
  }, []);

  const productLinks = [
    { image: pcImage1, title: 'PC', path: '/pc' },
    { image: access, title: 'Accessories', path: '/accessories' },
    { image: ecImage3, title: 'Chair Gamer', path: '/ChairGamer' },
  ];

  const handleProductClick = (path) => {
    if (!user) {
      navigate('/register'); 
    } else {
      navigate(path); 
    }
  };

  return (
    <Container fluid>
      <Carousel>
        <Carousel.Item>
          <img className="d-block w-100" src={slider1} alt="First slide" />
        </Carousel.Item>
        <Carousel.Item>
          <img className="d-block w-100" src={slider2} alt="Second slide" />
        </Carousel.Item>
        <Carousel.Item>
          <img className="d-block w-100" src={slider3} alt="third slide" />
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
