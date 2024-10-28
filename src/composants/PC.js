import React from 'react';
import './PCPage.css'; // Ensure you create this CSS file

const PCPage = () => {
  const recommendedProducts = [
    {
      id: 1,
      name: 'PC Gaming X',
      image: 'pc1.png',
      price: 1200,
      description: 'Powerful gaming PC with high performance.',
    },
    {
      id: 2,
      name: 'PC Workstation',
      image: 'pc2.png',
      price: 1500,
      description: 'Ideal for professional work and design tasks.',
    },
    {
      id: 3,
      name: 'PC Budget',
      image: 'pc3.png',
      price: 800,
      description: 'Affordable PC for everyday use.',
    },
    {
      id: 4,
      name: 'PC Mini',
      image: 'pc4.png',
      price: 600,
      description: 'Compact PC for small spaces.',
    },
    {
      id: 5,
      name: 'PC Gamer Pro',
      image: 'pc5.png',
      price: 2000,
      description: 'Top-notch gaming PC for the ultimate experience.',
    },
    {
      id: 6,
      name: 'PC All-in-One',
      image: 'pc6.png',
      price: 1300,
      description: 'Space-saving all-in-one PC for home or office.',
    },
  ];

  return (
    <div className="pc-page">
      <h1>Produits Recommandés</h1>
      <div className="product-grid">
        {recommendedProducts.map(product => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} />
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p className="price">${product.price}</p>
            <button className="buy-button">Acheter</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PCPage;
