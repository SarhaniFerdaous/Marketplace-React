import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, Row, Col } from "react-bootstrap";
import { db } from "../api/firebase.config";
import { collection, onSnapshot } from "firebase/firestore";

const ProductList = () => {
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up Firestore real-time listener
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      const newProducts = {};
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        const category = data.productType;
        if (!newProducts[category]) {
          newProducts[category] = [];
        }
        newProducts[category].push({ id: doc.id, ...data });
      });
      setProducts(newProducts);
      setLoading(false);
    });

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, []);

  const handleAddToBasket = (productId, quantity) => {
    // Logic to add the product to the basket
    console.log(`Added ${quantity} of product ${productId} to basket`);
  };

  return (
    <div>
      {loading ? (
        <p>Loading products...</p>
      ) : (
        Object.keys(products).map((category) => (
          <div key={category}>
            <h2>{category}</h2>
            <Row>
              {products[category].map((product) => (
                <Col key={product.id} sm={12} md={6} lg={4}>
                  <Card className="mb-4">
                    <Card.Img variant="top" src={product.imageUrl} />
                    <Card.Body>
                      <Card.Title>{product.brand} - {product.productType}</Card.Title>
                      <Card.Text>{product.description}</Card.Text>
                      <Row>
                        <Col>
                          <p>Price: {product.price} {product.currency}</p>
                          <p>Quantity: {product.amount}</p>
                        </Col>
                        <Col>
                          <div className="d-flex justify-content-end">
                            <Button variant="outline-secondary">-</Button>
                            <span className="mx-2">1</span>
                            <Button variant="outline-secondary">+</Button>
                          </div>
                        </Col>
                      </Row>
                      <Button
                        variant="primary"
                        onClick={() => handleAddToBasket(product.id, 1)}
                      >
                        Add to Basket
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        ))
      )}
    </div>
  );
};

export default ProductList;
