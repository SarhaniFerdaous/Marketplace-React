import React, { useContext, useState } from "react";
import { Row, Col, Card, InputGroup, Button, FormControl, Modal } from "react-bootstrap";
import { FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { BasketContext } from "../context/BasketContext";
import { toast } from "react-toastify";
import emailjs from "emailjs-com";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, updateDoc, doc, getDoc } from "firebase/firestore"; // Firestore imports

const Panier = () => {
  const { basket, updateQuantity, removeFromBasket } = useContext(BasketContext);
  const navigate = useNavigate();

  const [showModals, setShowModals] = useState({
    first: false,
    payment: false,
    delivery: false,
  });
  const [paymentDetails, setPaymentDetails] = useState({
    method: "",
    cardNumber: "",
    cardCode: "",
    deliveryAddress: "",
    phoneNumber: "",
  });

  const calculateTotal = () => basket.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const toggleModal = (type, state) => setShowModals({ ...showModals, [type]: state });

  const handleConfirmPayment = async () => {
    const { method, cardNumber, cardCode, deliveryAddress, phoneNumber } = paymentDetails;
  
    if (method === "online" && (!cardNumber || !cardCode)) {
      return toast.error("Invalid card details.");
    }
    if (method === "delivery" && (!deliveryAddress || !phoneNumber)) {
      return toast.error("Invalid delivery details.");
    }
  
    try {
      // Get the current user
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        return toast.error("User is not logged in.");
      }
  
      // Save the purchase details in Firestore (in the 'ventes' collection)
      const db = getFirestore();
      const ventesCollection = collection(db, "ventes");
  
      // Loop through the basket items and save each purchase
      for (const item of basket) {
        // Save each item purchased to 'ventes'
        const purchaseData = {
          userId: user.uid,
          email: user.email,
          productId: item.id,
          quantity: item.quantity,
          total: item.price * item.quantity,
          paymentMethod: method,
          status: "confirmed",
          date: new Date(),
        };
  
        // If payment is on delivery, add delivery address and phone number
        if (method === "delivery") {
          purchaseData.deliveryAddress = deliveryAddress;
          purchaseData.phoneNumber = phoneNumber;
        }
  
        // Add the purchase data to Firestore
        await addDoc(ventesCollection, purchaseData);
  
        // Update the quantity of the product in Firestore
        const productRef = doc(db, "products", item.id);
        const productSnap = await getDoc(productRef);
  
        if (productSnap.exists()) {
          const productData = productSnap.data();
          const newAmount = productData.amount - item.quantity;
  
          // Ensure that quantity doesn't go below 0
          if (newAmount < 0) {
            return toast.error("Insufficient stock for product: " + item.description);
          }
  
          // Update the product quantity
          await updateDoc(productRef, { amount: newAmount });
        } else {
          return toast.error("Product not found in database.");
        }
  
        // Remove the item from the basket after purchase
        removeFromBasket(item.id);
      }
  
      toast.success(method === "online" ? "Online payment successful!" : "Payment on delivery confirmed!");
      sendEmail();
      toggleModal("payment", false);
      toggleModal("delivery", false);
      toggleModal("first", false);
  
      // Redirect to the home page after successful payment
      navigate("/");
  
    } catch (error) {
      toast.error("Error processing payment: " + error.message);
    }
  };
  

  const sendEmail = () => {
    const user = getAuth().currentUser;
    if (!user?.email) return console.error("User not logged in or email unavailable");
    emailjs.send(
      "service_p9yhwfl",
      "template_pqgjogc",
      {
        to_email: user.email,
        to_name: "Customer",
        from_name: "Marketplace",
        basket_details: basket.map((item) => `${item.brand} - ${item.description} x ${item.quantity} = ${item.price * item.quantity}`).join("\n"),
        total: calculateTotal(),
      },
      "KOjUfnsD82D1TWITH"
    );
  };

  const updatePaymentDetails = (key, value) => setPaymentDetails({ ...paymentDetails, [key]: value });

  const handleQuantityChange = (item, increment) => {
    const newQuantity = item.quantity + increment;
    if (newQuantity < 1 || newQuantity > item.amount) {
      return toast.error(`Invalid quantity. Max: ${item.amount}`);
    }
    updateQuantity(item.id, increment);
  };

  const renderCard = (item) => (
    <Col key={item.id} sm={12} md={6} lg={4}>
      <Card className="mb-3 shadow-sm">
        <Card.Img variant="top" src={item.imageUrl} alt={item.description} className="p-3" style={{ height: "200px", objectFit: "contain" }} />
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center">
            <Card.Title>{item.brand} - {item.description}</Card.Title>
            <FaTrashAlt className="text-danger" style={{ cursor: "pointer" }} onClick={() => removeFromBasket(item.id)} />
          </div>
          <Card.Text>Price: {item.price} x {item.quantity} = {item.price * item.quantity}</Card.Text>
          <InputGroup className="my-2">
            <Button variant="outline-secondary" onClick={() => handleQuantityChange(item, -1)}>-</Button>
            <FormControl readOnly value={item.quantity} className="text-center" />
            <Button variant="outline-secondary" onClick={() => handleQuantityChange(item, 1)} disabled={item.amount === 0}>+</Button>
          </InputGroup>
          <small className="text-muted">Available: {item.amount}</small>
          {item.amount === 0 && <p className="text-danger">Out of stock</p>}
        </Card.Body>
      </Card>
    </Col>
  );

  return (
    <div className="p-3">
      <h2>Basket</h2>
      {basket.length === 0 ? (
        <p>Your basket is empty.</p>
      ) : (
        <>
          <Row>{basket.map(renderCard)}</Row>
          <h4 className="text-right mt-4">Total: {calculateTotal()}</h4>
          <Button className="mt-3 w-100" onClick={() => toggleModal("first", true)} disabled={basket.some(item => item.amount === 0)}>
            Checkout
          </Button>

          {/* Modals */}{["first", "payment", "delivery"].map((type) => (
            <Modal key={type} show={showModals[type]} onHide={() => toggleModal(type, false)}>
              <Modal.Header closeButton>
                <Modal.Title>
                  {type === "first"
                    ? "Choose Payment Method"
                    : type === "payment"
                    ? "Card Details"
                    : "Delivery Details"}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {type === "first" ? (
                  <>
                    <Button
                      className="w-100 mb-2"
                      onClick={() => {
                        toggleModal("payment", true);
                        updatePaymentDetails("method", "online");
                      }}
                    >
                      Online Payment
                    </Button>
                    <Button
                      className="w-100"
                      onClick={() => {
                        toggleModal("delivery", true);
                        updatePaymentDetails("method", "delivery");
                      }}
                    >
                      Payment on Delivery
                    </Button>
                  </>
                ) : type === "payment" ? (
                  <>
                    <InputGroup className="mb-3">
                      <FormControl
                        placeholder="Card Number"
                        value={paymentDetails.cardNumber}
                        onChange={(e) => updatePaymentDetails("cardNumber", e.target.value)}
                      />
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <FormControl
                        type="password"  // Change to password type
                        placeholder="Card Code"
                        value={paymentDetails.cardCode}
                        onChange={(e) => updatePaymentDetails("cardCode", e.target.value)}
                      />
                    </InputGroup>
                  </>
                ) : (
                  <>
                    <InputGroup className="mb-3">
                      <FormControl
                        placeholder="Delivery Address"
                        value={paymentDetails.deliveryAddress}
                        onChange={(e) => updatePaymentDetails("deliveryAddress", e.target.value)}
                      />
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <FormControl
                        placeholder="Phone Number"
                        value={paymentDetails.phoneNumber}
                        onChange={(e) => updatePaymentDetails("phoneNumber", e.target.value)}
                      />
                    </InputGroup>
                  </>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => toggleModal(type, false)}>
                  Close
                </Button>
                {type === "delivery" || type === "payment" ? (
                  <Button
                    variant="primary"
                    onClick={handleConfirmPayment}
                  >
                    Confirm Payment
                  </Button>
                ) : null}
              </Modal.Footer>
            </Modal>
          ))}
        </>
      )}
    </div>
  );
};

export default Panier;
