import React, { useEffect, useState, useContext } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { db } from "../api/firebase.config";
import { collection, onSnapshot } from "firebase/firestore";
import { BasketContext } from "../context/BasketContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductList = ({ productType, searchText }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToBasket } = useContext(BasketContext);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      const productList = [];
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (productType === "All" || data.productType === productType) {
          productList.push({ id: doc.id, ...data });
        }
      });
      const filteredProducts = productList.filter((product) =>
        (!searchText ||
          product.brand.toLowerCase().includes(searchText.toLowerCase()) ||
          product.description.toLowerCase().includes(searchText.toLowerCase()))
      );
      setProducts(filteredProducts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [productType, searchText]);

  const handleAddToBasket = (productId) => {
    const product = products.find((p) => p.id === productId);
    const quantity = 1;

    addToBasket(product, quantity);

    toast.success(`${product.brand} added to the basket!`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const styles = { 
    container: {
      padding: "3rem 2rem",
      backgroundColor: "#f7f7f7",
      fontFamily: "'Roboto', sans-serif",
    },
    card: {
      backgroundColor: "#ffffff",
      border: "1px solid #e0e0e0",
      borderRadius: "10px",
      overflow: "hidden",
      transition: "box-shadow 0.3s ease, transform 0.3s ease",
      marginBottom: "2rem",
    },
    cardHover: {
      transform: "translateY(-5px)",
      boxShadow: "0 8px 15px rgba(0, 0, 0, 0.1)",
    },
    imageContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      backgroundColor: "#f4f4f4",
      borderBottom: "1px solid #eaeaea",
      overflow: "hidden",
      height: "auto",
    },
    image: {
      width: "100%",
      height: "auto",
      objectFit: "contain",
      transition: "transform 0.3s ease",
    },
    cardBody: {
      padding: "1.5rem",
      textAlign: "left",
    },
    cardTitle: {
      fontSize: "1.2rem",
      fontWeight: "bold",
      color: "#2c3e50",
      marginBottom: "0.5rem",
    },
    cardText: {
      fontSize: "1rem",
      color: "#7f8c8d",
      marginBottom: "1rem",
      lineHeight: "1.5",
    },
    info: {
      margin: "0.3rem 0",
      fontSize: "0.95rem",
      color: "#34495e",
    },
    button: {
      backgroundColor: "#3498db",
      color: "#ffffff",
      fontSize: "0.9rem",
      fontWeight: "bold",
      padding: "0.5rem 1rem",
      border: "none",
      borderRadius: "5px",
      transition: "background-color 0.3s ease, transform 0.2s ease",
      width: "100%",
    },
    buttonHover: {
      backgroundColor: "#2980b9",
      transform: "translateY(-2px)",
    },
    responsive: {
      "@media (max-width: 768px)": {
        card: {
          marginBottom: "1.5rem",
        },
        imageContainer: {
          height: "200px",
        },
        cardTitle: {
          fontSize: "1rem",
        },
        button: {
          fontSize: "0.85rem",
        },
      },
    },
  };

  return (
    <div style={styles.container}>
      <ToastContainer />
      
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div>
          <Row>
            {products.length === 0 ? (
              <p>No products found in this category.</p>
            ) : (
              products.map((product) => (
                <Col key={product.id} sm={12} md={6} lg={4}>
                  <Card
                    className="product-card"
                    style={styles.card}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                  >
                    <div style={styles.imageContainer}>
                      <Card.Img
                        className="product-image"
                        style={styles.image}
                        src={product.imageUrl}
                        alt={product.brand}
                      />
                    </div>
                    <Card.Body style={styles.cardBody}>
                      <Card.Title style={styles.cardTitle}>
                        {product.brand} - {product.productType}
                      </Card.Title>
                      <Card.Text style={styles.cardText}>
                        {product.description}
                      </Card.Text>
                      <Row>
                        <Col style={styles.info}>
                          <p>Price: {product.price} {product.currency}</p>
                          <p>Available Quantity: {product.amount}</p>
                        </Col>
                      </Row>
                      <Button
                        style={styles.button}
                        onClick={() => handleAddToBasket(product.id)}
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
