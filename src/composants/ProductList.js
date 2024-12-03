import React, { useEffect, useState, useContext } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { db } from "../api/firebase.config";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { BasketContext } from "../context/BasketContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductList = ({ productType, searchText }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToBasket } = useContext(BasketContext);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), async (snapshot) => {
      const productList = [];
      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        if (data.amount === 0) {
          // Delete the product if available quantity is 0
          await deleteDoc(doc(db, "products", docSnap.id));
        } else if (productType === "All" || data.productType === productType) {
          productList.push({ id: docSnap.id, ...data });
        }
      }

      const filteredProducts = productList.filter((product) =>
        !searchText ||
        product.brand.toLowerCase().includes(searchText.toLowerCase()) ||
        product.description.toLowerCase().includes(searchText.toLowerCase())
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
      padding: "2rem 1rem",
      backgroundColor: "#f7f7f7",
      fontFamily: "'Roboto', sans-serif",
    },
    card: {
      backgroundColor: "#ffffff",
      border: "1px solid #e0e0e0",
      borderRadius: "10px",
      overflow: "hidden",
      transition: "box-shadow 0.3s ease, transform 0.3s ease",
      marginBottom: "1.5rem",
      padding: "1rem", // Reduced padding
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
      backgroundColor: "#ffffff",
      borderBottom: "1px solid #eaeaea",
      overflow: "hidden",
      height: "150px", // Fixed height
    },
    image: {
      width: "100%",
      height: "100%", // Match container height
      objectFit: "contain", // Ensure the entire image fits within the container
      transition: "transform 0.3s ease",
    },
    cardBody: {
      padding: "0.8rem", // Reduced padding
      textAlign: "left",
    },
    cardTitle: {
      fontSize: "1rem", // Reduced font size
      fontWeight: "bold",
      color: "#2c3e50",
      marginBottom: "0.3rem", // Reduced margin
    },
    cardText: {
      fontSize: "0.9rem", // Reduced font size
      color: "#7f8c8d",
      marginBottom: "0.8rem", // Reduced margin
      lineHeight: "1.4",
    },
    info: {
      margin: "0.2rem 0", // Reduced spacing
      fontSize: "0.85rem", // Reduced font size
      color: "#34495e",
    },
    button: {
      backgroundColor: "#3498db",
      color: "#ffffff",
      fontSize: "0.85rem", // Reduced font size
      fontWeight: "bold",
      padding: "0.4rem 0.8rem", // Reduced padding
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
          marginBottom: "1rem",
        },
        imageContainer: {
          height: "120px", // Adjusted for smaller screens
        },
        cardTitle: {
          fontSize: "0.9rem", // Smaller for mobile
        },
        button: {
          fontSize: "0.75rem", // Smaller button text
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
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "translateY(-5px)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "translateY(0)")
                    }
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
