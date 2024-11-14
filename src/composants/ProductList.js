import React, { useEffect, useState } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { db } from "../api/firebase.config";
import { collection, onSnapshot } from "firebase/firestore";

const ProductList = ({ productType }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      const productList = [];
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        // Only include products that match the productType
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
    <div>
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div>
          {/* Heading for the page based on the productType */}
          <h2>{productType} Products</h2>
          <Row>
            {products.length === 0 ? (
              <p>No products found in this category.</p>
            ) : (
              products.map((product) => (
                <Col key={product.id} sm={12} md={6} lg={4}>
                  <Card className="mb-4">
                    <Card.Img variant="top" src={product.imageUrl} />
                    <Card.Body>
                      <Card.Title>{product.brand} - {product.productType}</Card.Title>
                      <Card.Text>{product.description}</Card.Text>
                      <Row>
                        <Col>
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
