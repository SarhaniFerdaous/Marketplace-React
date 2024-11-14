import React, { useState } from "react";
import { Container, Form, Button, Row, Col, Alert } from "react-bootstrap";
import { db } from "../api/firebase.config";
import { collection, addDoc } from "firebase/firestore";

const AddProductForm = () => {
  const [productType, setProductType] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("TND");
  const [amount, setAmount] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(""); // Store the image URL here
  const [brand, setBrand] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result); // Set the data URL of the image
        setImage(file); // Store the actual file (if needed for validation or future reference)
      };
      reader.readAsDataURL(file); // This converts the image file to a base64 string
    }
  };

  const resetForm = () => {
    setProductType("");
    setDescription("");
    setPrice("");
    setCurrency("TND");
    setAmount("");
    setImage(null);
    setImageUrl(""); // Clear the image URL
    setBrand("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for required fields
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
      // Save the product data to Firestore
      const productData = {
        productType,
        description,
        price,
        currency,
        amount,
        brand,
        imageUrl, // Save the image URL (base64 or external URL)
        createdAt: new Date(),
      };

      // Add the product data to Firestore
      await addDoc(collection(db, "products"), productData);

      // Success message and reset form
      setMessage({ type: "success", text: "Product added successfully!" });
      resetForm();
    } catch (error) {
      console.error("Error adding product: ", error);
      setMessage({ type: "danger", text: "Failed to add product. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      {/* Display success or error messages */}
      {message.text && <Alert variant={message.type}>{message.text}</Alert>}

      <Form onSubmit={handleSubmit}>
        {/* Product Type Radio Buttons */}
        <Form.Group as={Row}>
          <Form.Label as="legend" column sm={2}>
            Type de Produit
          </Form.Label>
          <Col sm={10}>
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
              label="Ecran"
              name="productType"
              value="Ecran"
              onChange={(e) => setProductType(e.target.value)}
              checked={productType === "Ecran"}
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
        </Form.Group>

        {/* Description Input */}
        <Form.Group controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter product description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        {/* Price and Currency Input */}
        <Form.Group controlId="price">
          <Form.Label>Price</Form.Label>
          <Row>
            <Col>
              <Form.Control
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Col>
            <Col>
              <Form.Control
                as="select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="TND">TND</option>
                <option value="Dollar">Dollar</option>
              </Form.Control>
            </Col>
          </Row>
        </Form.Group>

        {/* Amount Input */}
        <Form.Group controlId="amount">
          <Form.Label>Amount</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </Form.Group>

        {/* Brand Input */}
        <Form.Group controlId="brand">
          <Form.Label>La Marque</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter product brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
        </Form.Group>

        {/* Image Input */}
        <Form.Group controlId="image">
          <Form.Label>Product Image</Form.Label>
          <Form.Control type="file" onChange={handleFileChange} accept="image/*" />
        </Form.Group>

        {/* Submit Button */}
        <Button variant="primary" type="submit" className="mt-3" disabled={loading}>
          {loading ? "Processing..." : "Ajouter Produit"}
        </Button>
      </Form>
    </Container>
  );
};

export default AddProductForm;
