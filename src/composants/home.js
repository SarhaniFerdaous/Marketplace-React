import React from 'react';
import { Carousel, Container } from 'react-bootstrap';
import './home.css';  // Ensure this matches your file structure

import pcImage1 from '../photo/pc1.png';  // First product image
import pcImage2 from '../photo/pc2.png';  // Second product image
import pcImage3 from '../photo/pc3.png';  // Third product image
import ecImage1 from '../photo/ec1.png';  // Fourth product image
import ecImage2 from '../photo/ec2.png';  // Fifth product image
import ecImage3 from '../photo/ec3.png';  // Sixth product image
import offre3 from '../photo/offre3.png';  // New offer image
import csImage from '../photo/cs.png';  // New image to be added

const HomePage = () => {
  const productImages = [
    pcImage1,
    pcImage2,
    pcImage3,
    ecImage1,
    ecImage2,
    ecImage3
  ];

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
          <div key={idx} className="product-card">
            <img className="product-image" src={image} alt={`Product ${idx + 1}`} />
            <div className="product-title">Product {idx + 1}</div>
            <div className="product-price">Price: $199.99</div>
          </div>
        ))}

        {/* Insert offre3 image */}
        <div className="offer-image">
          <img src={offre3} alt="Offer 3" />
        </div>

        {/* New CS Image Offer */}
        <div className="offer-image">
          <img src={csImage} alt="Offer CS" />
        </div>

        {productImages.slice(3).map((image, idx) => (
          <div key={idx + 3} className="product-card">
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
