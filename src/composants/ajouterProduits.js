import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { Container, Form, Button, Row, Col, Alert } from "react-bootstrap";
import { getAuth } from "firebase/auth";  
import { db } from "../api/firebase.config";
import { collection, addDoc } from "firebase/firestore";
import { generateSearchKeywords } from "../utils/productHelpers";

const AddProductForm = () => {
  const [productType, setProductType] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("TND");
  const [amount, setAmount] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(""); 
  const [brand, setBrand] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const navigate = useNavigate(); 

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result); 
        setImage(file); 
      };
      reader.readAsDataURL(file); 
    }
  };

  const resetForm = () => {
    setProductType("");
    setDescription("");
    setPrice("");
    setCurrency("TND");
    setAmount("");
    setImage(null);
    setImageUrl(""); 
    setBrand("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productType || !description || !price || !amount || !brand || !imageUrl) {
      setMessage({ type: "danger", text: "Please fill all required fields." });
      return;
    }

    if (price <= 0 || amount <= 0) {
      setMessage({ type: "danger", text: "Price and amount must be positive values." });
      return;
    }

    if (brand.length > 20) {
      setMessage({ type: "danger", text: "Brand name must not exceed 20 characters." });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "Processing your product..." });

    try {
      const auth = getAuth(); 
      const user = auth.currentUser; 

      if (!user) {
        setMessage({ type: "danger", text: "You must be logged in to add a product." });
        return;
      }

      const productData = {
        productType,
        description,
        price,
        currency,
        amount,
        brand,
        imageUrl, 
        createdAt: new Date(),
        userId: user.uid, 
      };

      
      const productDocRef = await addDoc(collection(db, "products"), productData);

      await generateSearchKeywords(productDocRef.id); 

      setMessage({ type: "success", text: "Product added successfully!" });
      resetForm();

      
      if (productType === "PC") {
        navigate("/pc"); 
      } else if (productType === "accessories") {
        navigate("/Accessories");
      } else if (productType === "Chair Gamer") {
        navigate("/chairgamer"); 
      }
    } catch (error) {
      console.error("Error adding product: ", error);
      setMessage({ type: "danger", text: "Failed to add product. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
    
      {message.text && <Alert variant={message.type}>{message.text}</Alert>}

      <Form onSubmit={handleSubmit} style={styles.formContainer}>
       
        <Form.Group as={Row} style={styles.formGroup}>
          <Form.Label as="legend" column sm={2} style={styles.formLabel}>
            Type of product
          </Form.Label>
          <Col sm={10}>
            <Form.Check
              type="radio"
              label="PC"
              name="productType"
              value="PC"
              onChange={(e) => setProductType(e.target.value)}
              checked={productType === "PC"}
              style={styles.formCheck}
            />
            <Form.Check
              type="radio"
              label="Accessories"
              name="productType"
              value="accessories"
              onChange={(e) => setProductType(e.target.value)}
              checked={productType === "accessories"}
              style={styles.formCheck}
            />
            <Form.Check
              type="radio"
              label="Chair Gamer"
              name="productType"
              value="Chair Gamer"
              onChange={(e) => setProductType(e.target.value)}
              checked={productType === "Chair Gamer"}
              style={styles.formCheck}
            />
          </Col>
        </Form.Group>

        <Form.Group controlId="description" style={styles.formGroup}>
          <Form.Label style={styles.formLabel}>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={styles.formControl}
          />
        </Form.Group>

        <Form.Group as={Row} style={styles.formGroup}>
          <Col sm={6}>
            <Form.Label style={styles.formLabel}>Price</Form.Label>
            <Form.Control
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              style={styles.formControl}
            />
          </Col>
          <Col sm={6}>
            <Form.Label style={styles.formLabel}>Amount</Form.Label>
            <Form.Control
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              style={styles.formControl}
            />
          </Col>
        </Form.Group>

        <Form.Group controlId="brand" style={styles.formGroup}>
          <Form.Label style={styles.formLabel}>Brand</Form.Label>
          <Form.Control
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            required
            style={styles.formControl}
          />
        </Form.Group>

        <Form.Group controlId="image" style={styles.formGroup}>
          <Form.Label style={styles.formLabel}>Product Image</Form.Label>
          <Form.Control
            type="file"
            onChange={handleFileChange}
            required
            style={styles.formControl}
          />
          {imageUrl && (
            <div style={styles.imagePreview}>
              <img src={imageUrl} alt="Product Preview" width={100} />
            </div>
          )}
        </Form.Group>

        <Button variant="primary" type="submit" disabled={loading} style={styles.submitButton}>
          {loading ? "Submitting..." : "Add Product"}
        </Button>
      </Form>
    </Container>
  );
};

const styles = {
  formContainer: {
    padding: "20px",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    boxShadow: "0 0 15px rgba(0, 0, 0, 0.1)",
  },
  formGroup: {
    marginBottom: "15px",
  },
  formLabel: {
    fontWeight: "bold",
    fontSize: "16px",
  },
  formCheck: {
    marginBottom: "10px",
  },
  formControl: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ced4da",
  },
  imagePreview: {
    marginTop: "10px",
  },
  submitButton: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    backgroundColor: "#28a745",
    borderColor: "#28a745",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default AddProductForm;
