import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Row, Col, Alert } from "react-bootstrap";
import { getAuth } from "firebase/auth";
import { db } from "../api/firebase.config";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
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
  const [productId, setProductId] = useState("");

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
    setProductId("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productType || !description || !price || !amount || !brand || !imageUrl || !productId) {
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

      const productRef = await addDoc(collection(db, "products"), productData);

      const keywords = await generateSearchKeywords(productData.productType, brand, description, productRef.id);

      await setDoc(doc(db, "products", productRef.id), { searchKeywords: keywords }, { merge: true });

      setMessage({ type: "success", text: "Product added successfully!" });
      resetForm();

      if (productType === "PC") {
        navigate("/pc");
      } else if (productType === "Accessories") {
        navigate("/accessories");
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
    <Container className="py-4">
      {message.text && <Alert variant={message.type}>{message.text}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row className="mb-4">
          <Col sm={12} lg={6}>
            <Form.Label as="legend" className="d-block">Type de Produit</Form.Label>
            <Form.Check
              type="radio"
              label="PC"
              name="productType"
              value="PC"
              onChange={(e) => setProductType(e.target.value)}
              checked={productType === "PC"}
            />
            <Form.Check
              type="radio"
              label="Accessories"
              name="productType"
              value="Accessories"
              onChange={(e) => setProductType(e.target.value)}
              checked={productType === "Accessories"}
            />
            <Form.Check
              type="radio"
              label="Chair Gamer"
              name="productType"
              value="Chair Gamer"
              onChange={(e) => setProductType(e.target.value)}
              checked={productType === "Chair Gamer"}
            />
          </Col>
        </Row>

        <Form.Group controlId="description" className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Form.Group>

        <Row className="mb-4">
          <Col sm={12} md={6}>
            <Form.Group controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col sm={12} md={6}>
            <Form.Group controlId="amount">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group controlId="brand" className="mb-3">
          <Form.Label>Brand</Form.Label>
          <Form.Control
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="image" className="mb-4">
          <Form.Label>Product Image</Form.Label>
          <Form.Control type="file" onChange={handleFileChange} required />
          {imageUrl && (
            <div className="mt-3">
              <img src={imageUrl} alt="Product Preview" width={150} className="rounded" />
            </div>
          )}
        </Form.Group>

        <Button variant="primary" type="submit" disabled={loading} className="w-100">
          {loading ? "Submitting..." : "Add Product"}
        </Button>
      </Form>
    </Container>
  );
};

export default AddProductForm;
