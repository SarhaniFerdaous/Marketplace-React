import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { onSnapshot, collection } from "firebase/firestore";
import { db } from "../api/firebase.config"; // Adjust the import path to your Firebase config
import { BasketContext } from "../context/BasketContext"; // Adjust based on where your context is defined

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
};

const ProductCard = ({ product, productType, searchText }) => {
  const { addToBasket } = useContext(BasketContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
        !searchText ||
        product.brand.toLowerCase().includes(searchText.toLowerCase()) ||
        product.description.toLowerCase().includes(searchText.toLowerCase())
      );

      setProducts(filteredProducts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [productType, searchText]);

  const handleAddToBasket = () => {
    const quantity = 1;

    if (product) {
      addToBasket(product, quantity);

      toast.success(`${product.brand} added to the basket!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const price = isNaN(product.price) ? 0 : parseFloat(product.price);

  return (
    <div
      className="product-card"
      style={styles.card}
      onMouseEnter={(e) => {
        Object.assign(e.currentTarget.style, styles.cardHover);
      }}
      onMouseLeave={(e) => {
        Object.assign(e.currentTarget.style, styles.card);
      }}
    >
      <div style={styles.imageContainer}>
        <img
          src={product.imageUrl || "https://via.placeholder.com/150"}
          alt={product.name}
          style={styles.image}
        />
      </div>
      <div style={styles.cardBody}>
        <h3 style={styles.cardTitle}>{product.name}</h3>
        <p style={styles.cardText}>{product.description || "No description available"}</p>
        <p style={styles.info}>Amount: {product.amount} available</p>
        <p style={{ ...styles.info, fontWeight: "bold", color: "black" }}>
          Price: {product.currency} {price.toFixed(2)}
        </p>
        <button
          style={styles.button}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = styles.button.backgroundColor)}
          onClick={handleAddToBasket}
        >
          Add to Basket
        </button>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    currency: PropTypes.string.isRequired,
    description: PropTypes.string,
    amount: PropTypes.number.isRequired,
    imageUrl: PropTypes.string,
  }).isRequired,
  productType: PropTypes.string.isRequired,
  searchText: PropTypes.string.isRequired,
};

export default ProductCard;
