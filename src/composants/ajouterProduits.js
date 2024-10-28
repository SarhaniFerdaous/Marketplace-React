import React, { useState } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";

// Inline CSS styles for the component
const styles = {
  container: {
    maxWidth: "600px",
    marginTop: "30px",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
  },
  formControl: {
    borderColor: "#007bff",
    borderRadius: "5px",
  },
  submitButton: {
    width: "100%",
  },
};

const AddProductForm = () => {
  const [productType, setProductType] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("TND");
  const [amount, setAmount] = useState("");
  const [image, setImage] = useState(null);
  const [brand, setBrand] = useState("");

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the form submission here. You can send the data to your server or Firebase.
    console.log({
      productType,
      description,
      price,
      currency,
      amount,
      image,
      brand,
    });
  };

  return (
    <Container style={styles.container}>
      <h2 style={styles.heading}>Ajouter Produit</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group as={Row}>
          <Form.Label as="legend" column sm={4}>
            Type de Produit
          </Form.Label>
          <Col sm={8}>
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

        <Form.Group controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter product description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.formControl}
          />
        </Form.Group>

        <Form.Group controlId="price">
          <Form.Label>Price</Form.Label>
          <Row>
            <Col>
              <Form.Control
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                style={styles.formControl}
              />
            </Col>
            <Col>
              <Form.Control
                as="select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                style={styles.formControl}
              >
                <option value="TND">TND</option>
                <option value="Dollar">Dollar</option>
              </Form.Control>
            </Col>
          </Row>
        </Form.Group>

        <Form.Group controlId="amount">
          <Form.Label>Amount</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={styles.formControl}
          />
        </Form.Group>

        <Form.Group controlId="image">
          <Form.Label>Product Image</Form.Label>
          <Form.Control type="file" onChange={handleFileChange} style={styles.formControl} />
        </Form.Group>

        <Form.Group controlId="brand">
          <Form.Label>La Marque</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter product brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            style={styles.formControl}
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3" style={styles.submitButton}>
          Ajouter Produit
        </Button>
      </Form>
    </Container>
  );
};

export default AddProductForm;
