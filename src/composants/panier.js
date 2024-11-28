import React, { useContext, useState } from "react";
import { Row,Col,Card,InputGroup,Button, FormControl,Modal,
} from "react-bootstrap";
import { FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { BasketContext } from "../context/BasketContext";
import { toast } from "react-toastify";
import emailjs from "emailjs-com";
import { getAuth } from "firebase/auth";

const Panier = () => {
  const { basket, updateQuantity, removeFromBasket } = useContext(BasketContext);
  const navigate = useNavigate();

  const [showFirstModal, setShowFirstModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardCode, setCardCode] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const calculateTotal = () =>
    basket.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePayer = () => {
    setShowFirstModal(true);
  };

  const handleConfirmPayment = () => {
    if (paymentMethod === "online") {
      if (!cardNumber || !cardCode) {
        toast.error("Please enter valid card details.");
        return;
      }
      toast.success("Online payment successful!");
      sendEmail();
      setShowPaymentModal(false);
      setShowFirstModal(false);
      navigate("/payment");
    } else if (paymentMethod === "delivery") {
      if (!deliveryAddress || !phoneNumber) {
        toast.error("Please enter valid delivery details.");
        return;
      }
      toast.success("Payment on delivery confirmed!");
      sendEmail();
      setShowFirstModal(false);
      setShowDeliveryModal(false);
      navigate("/order-confirmation");
    }
  };

  const getUserEmail = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    return user ? user.email : null;
  };

  const sendEmail = () => {
    const userEmail = getUserEmail(); // Retrieve the email of the currently logged-in user
    if (!userEmail) {
        console.error("User not logged in or email not available");
        return;
    }

    if (!basket || basket.length === 0) {
        console.error("Basket is empty or not defined");
        return;
    }

    const total = calculateTotal();
    if (typeof total !== "number" || total <= 0) {
        console.error("Total amount is invalid");
        return;
    }

    // Show loading indicator (Optional)
    console.log("Sending email...");

    const emailParams = {
        to_email: userEmail, // Recipient's email
        to_name: "Customer", // Customize recipient's name if available
        from_name: "Marketplace", // Sender's name
        subject: "Your Purchase Details", // Subject of the email
        basket_details: basket
            .map(
                (item) =>
                    `${item.brand} - ${item.description} x ${item.quantity} = $${(
                        item.price * item.quantity
                    ).toFixed(2)}`
            )
            .join("\n"),
        total: `$${total.toFixed(2)}`, // Format total as currency
    };

    emailjs
        .send(
            "service_p9yhwfl", // Replace with your EmailJS service ID
            "template_pqgjogc", // Replace with your EmailJS template ID
            emailParams, // Email parameters
            "KOjUfnsD82D1TWITH" // Replace with your EmailJS public key
        )
        .then(
            (result) => {
                console.log("Email sent successfully:", result.text);
                // Display success message to the user (Optional)
                alert("Your email has been sent successfully!");
            },
            (error) => {
                console.error("Error sending email:", error.text);
                // Display error message to the user (Optional)
                alert("There was an error sending your email. Please try again.");
            }
        );
};


  const handleDecreaseQuantity = (item) => {
    if (item.quantity > 1) {
      updateQuantity(item.id, -1);
    }
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
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          flexShrink: 0,
                        }}
                      >
                        <FaTrashAlt
                          style={{
                            color: "#e74c3c",
                            cursor: "pointer",
                            fontSize: "30px",
                          }}
                          onClick={() => removeFromBasket(item.id)}
                        />
                      </div>
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

          {/* Modals */}
          <Modal show={showFirstModal} onHide={() => setShowFirstModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Choose Payment Method</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Button
                variant="primary"
                onClick={() => {
                  setPaymentMethod("online");
                  setShowPaymentModal(true);
                  setShowFirstModal(false);
                }}
                block
              >
                Online Payment
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setPaymentMethod("delivery");
                  setShowDeliveryModal(true);
                  setShowFirstModal(false);
                }}
                block
              >
                Payment on Delivery
              </Button>
            </Modal.Body>
          </Modal>

          <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Enter Card Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <InputGroup className="mb-3">
                <FormControl
                  placeholder="Card Number"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
              </InputGroup>
              <InputGroup className="mb-3">
                <FormControl
                  placeholder="Card Code"
                  value={cardCode}
                  onChange={(e) => setCardCode(e.target.value)}
                />
              </InputGroup>
              <Button variant="primary" onClick={handleConfirmPayment}>
                Confirm Payment
              </Button>
            </Modal.Body>
          </Modal>

          <Modal show={showDeliveryModal} onHide={() => setShowDeliveryModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Delivery Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <InputGroup className="mb-3">
                <FormControl
                  placeholder="Delivery Address"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                />
              </InputGroup>
              <InputGroup className="mb-3">
                <FormControl
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </InputGroup>
              <Button variant="primary" onClick={handleConfirmPayment}>
                Confirm Delivery
              </Button>
            </Modal.Body>
          </Modal>
        </div>
      )}
    </div>
  );
};

export default Panier;
