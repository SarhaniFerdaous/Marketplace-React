import React, { useContext, useState } from "react";
import {Row, Col,Card,InputGroup, Button,FormControl,Modal,} from "react-bootstrap"; // Import Bootstrap components
import { FaTrashAlt } from "react-icons/fa"; // Import the trash icon from react-icons
import { useNavigate } from "react-router-dom"; // For navigation
import { BasketContext } from "../context/BasketContext";
import { toast } from 'react-toastify';



const Panier = () => {
  const { basket, updateQuantity, removeFromBasket } = useContext(BasketContext);
  const navigate = useNavigate(); // For navigation

  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [cardNumber, setCardNumber] = useState(""); // Card number state
  const [cardCode, setCardCode] = useState(""); // Card code state

  const calculateTotal = () =>
    basket.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePayer = () => {
    setShowModal(true); // Show the payment popup
  };

  const handleConfirmPayment = () => {
    if (!cardNumber || !cardCode) {
      alert("Please enter valid card details.");
      return;
    }
    alert("Payment successful!");
    setShowModal(false); // Close the modal
    navigate("/payment"); // Example: Redirect to a payment page
  };

  const handleIncreaseQuantity = (item) => {
    if (item.quantity < item.amount) {
      updateQuantity(item.id, 1);
    } else {
      toast.error(
        `Cannot order more than the available quantity (${item.amount}).`,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    }
  };
  

  const handleDecreaseQuantity = (item) => {
    if (item.quantity > 1) {
      updateQuantity(item.id, -1);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Basket</h2>
      {basket.length === 0 ? (
        <p>Votre panier est vide.</p>
      ) : (
        <div>
          <Row>
            {basket.map((item) => (
              <Col key={item.id} sm={12} md={6} lg={4}>
                <Card
                  style={{
                    marginBottom: "20px",
                    border: "1px solid #e0e0e0",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#f8f8f8",
                      borderBottom: "1px solid #ddd",
                      padding: "10px",
                      height: "200px",
                    }}
                  >
                    <Card.Img
                      variant="top"
                      src={item.imageUrl}
                      alt={item.description}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                  <Card.Body>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Card.Title>
                        {item.brand} - {item.description}
                      </Card.Title>
                      <FaTrashAlt
                        style={{
                          color: "#e74c3c",
                          cursor: "pointer",
                          fontSize: "18px",
                        }}
                        onClick={() => removeFromBasket(item.id)}
                      />
                    </div>
                    <Card.Text>
                      Price: {item.price} x {item.quantity} ={" "}
                      {item.price * item.quantity}
                    </Card.Text>
                    <InputGroup style={{ marginTop: "10px" }}>
                      <Button
                        variant="outline-secondary"
                        onClick={() => handleDecreaseQuantity(item)}
                      >
                        -
                      </Button>
                      <FormControl
                        type="text"
                        value={item.quantity}
                        readOnly
                        style={{ textAlign: "center", maxWidth: "50px" }}
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() => handleIncreaseQuantity(item)}
                      >
                        +
                      </Button>
                    </InputGroup>
                    <p style={{ marginTop: "10px", color: "#7f8c8d" }}>
                      Available Quantity: {item.amount}
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          <div
            style={{
              marginTop: "20px",
              textAlign: "right",
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            <h4>Total: {calculateTotal()}</h4>
          </div>
          {/* Payer Button */}
          <div
            style={{
              textAlign: "center",
              marginTop: "30px",
            }}
          >
            <Button
              style={{
                backgroundColor: "#007bff",
                color: "#fff",
                padding: "15px 30px",
                borderRadius: "10px",
                fontSize: "1.25rem",
                fontWeight: "bold",
                border: "none",
                transition: "background-color 0.3s ease",
                width: "200px",
              }}
              onClick={handlePayer}
              onMouseEnter={(e) =>
                (e.target.style.backgroundColor = "#0056b3")
              }
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = "#007bff")
              }
            >
              Checkout
            </Button>
          </div>

          {/* Payment Modal */}
          <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Enter Payment Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <FormControl
                placeholder="Card Number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                style={{ marginBottom: "10px" }}
              />
              <FormControl
                placeholder="Card Code (CVC)"
                value={cardCode}
                onChange={(e) => setCardCode(e.target.value)}
                type="password"
              />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleConfirmPayment}>
                Confirm
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}
    </div>
  );
};

export default Panier;
