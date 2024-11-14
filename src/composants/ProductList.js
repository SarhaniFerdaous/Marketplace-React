import React, { useEffect, useState } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { db } from "../api/firebase.config";
import { collection, onSnapshot } from "firebase/firestore";
import "./ProductList.css"; // Import CSS file

const ProductList = ({ productType }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      const productList = [];
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (data.productType === productType) {
          productList.push({ id: doc.id, ...data });
        }
      });
      setProducts(productList);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup on component unmount
  }, [productType]);

  return (
    <div className="product-list-container">
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div>
          <h2>{productType} Products</h2>
          <Row>
            {products.length === 0 ? (
              <p>No products found in this category.</p>
            ) : (
              products.map((product) => (
                <Col key={product.id} sm={12} md={6} lg={4}>
                  <Card className="product-card">
                    <div className="product-image-container">
                      <Card.Img className="product-image" src={product.imageUrl} alt={product.brand} />
                    </div>
                    <Card.Body className="product-card-body">
                      <Card.Title className="product-card-title">{product.brand} - {product.productType}</Card.Title>
                      <Card.Text className="product-card-text">{product.description}</Card.Text>
                      <Row>
                        <Col className="product-card-info">
                          <p>Price: {product.price} {product.currency}</p>
                          <p>Available Quantity: {product.amount}</p>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        </div>
      )}
    </div>
  );
};

export default ProductList;
