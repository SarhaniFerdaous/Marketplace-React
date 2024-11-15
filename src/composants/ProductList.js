import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button, InputGroup, FormControl } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { db } from "../api/firebase.config";
import { collection, onSnapshot } from "firebase/firestore";
import "./ProductList.css";

const ProductList = ({ productType }) => {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({}); // State to track quantities
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

    return () => unsubscribe();
  }, [productType]);

  const handleQuantityChange = (productId, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) + delta), // Ensure quantity doesn't go below 0
    }));
  };

  const handleAddToBasket = (productId) => {
    const product = products.find((p) => p.id === productId);
    const quantity = quantities[productId] || 1; // Default to 1 if no quantity set

    if (quantity > 0) {
      // Navigate to the basket with product details and quantity
      navigate("/basket", {
        state: { product, quantity },
      });
    }
  };

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
                      <Card.Img
                        className="product-image"
                        src={product.imageUrl}
                        alt={product.brand}
                      />
                    </div>
                    <Card.Body className="product-card-body">
                      <Card.Title className="product-card-title">
                        {product.brand} - {product.productType}
                      </Card.Title>
                      <Card.Text className="product-card-text">
                        {product.description}
                      </Card.Text>
                      <Row>
                        <Col className="product-card-info">
                          <p>Price: {product.price} {product.currency}</p>
                          <p>Available Quantity: {product.amount}</p>
                        </Col>
                      </Row>
                      <InputGroup className="quantity-input-group mt-3">
                        <Button
                          variant="outline-secondary"
                          onClick={() => handleQuantityChange(product.id, -1)}
                        >
                          -
                        </Button>
                        <FormControl
                          type="text"
                          value={quantities[product.id] || 0}
                          readOnly
                          style={{ textAlign: "center", maxWidth: "50px" }}
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={() => handleQuantityChange(product.id, 1)}
                        >
                          +
                        </Button>
                      </InputGroup>
                      <Button
                        className="add-to-basket-button mt-3"
                        onClick={() => handleAddToBasket(product.id)}
                        style={{ backgroundColor: "#5DADE2", border: "none" }}
                      >
                        Add to Basket
                      </Button>
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
