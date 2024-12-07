import React, { useContext, useState } from "react";
import { Row, Col, Card, InputGroup, Button, FormControl, Modal } from "react-bootstrap";
import { FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { BasketContext } from "../context/BasketContext";
import { toast } from "react-toastify";
import emailjs from "emailjs-com";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, updateDoc, doc, getDoc } from "firebase/firestore"; 

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
    const { method, cardNumber, cardCode, expirationDate, deliveryAddress, phoneNumber } = paymentDetails;
  
   
    const cardNumberRegex = /^[0-9]{16}$/;
    if (method === "online" && (!cardNumber || !cardNumberRegex.test(cardNumber))) {
      return toast.error("Card number must be exactly 16 digits.");
    }

    const cardCodeRegex = /^[0-9]{3,4}$/; 
    if (method === "online" && (!cardCode || !cardCodeRegex.test(cardCode))) {
      return toast.error("Card code must be 3 or 4 digits.");
    }

    const expirationDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (method === "online" && (!expirationDate || !expirationDateRegex.test(expirationDate))) {
      return toast.error("Expiration date must be in the format MM/YY.");
    }

    if (method === "delivery" && (!deliveryAddress || !phoneNumber)) {
      return toast.error("Invalid delivery details.");
    }

    const phoneNumberRegex = /^[0-9]{8}$/;
    if (method === "delivery" && (!phoneNumber || !phoneNumberRegex.test(phoneNumber))) {
      return toast.error("Phone number must be exactly 8 digits and cannot contain spaces.");
    }
  
    try {

      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        return toast.error("User is not logged in.");
      }
  
      
      const db = getFirestore();
      const ventesCollection = collection(db, "ventes");
  
     
      for (const item of basket) {
        
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
  
       
        if (method === "delivery") {
          purchaseData.deliveryAddress = deliveryAddress;
          purchaseData.phoneNumber = phoneNumber;
        }
  
    
        await addDoc(ventesCollection, purchaseData);
  
        const productRef = doc(db, "products", item.id);
        const productSnap = await getDoc(productRef);
  
        if (productSnap.exists()) {
          const productData = productSnap.data();
          const newAmount = productData.amount - item.quantity;
  
          if (newAmount < 0) {
            return toast.error("Insufficient stock for product: " + item.description);
          }
  
          await updateDoc(productRef, { amount: newAmount });
        } else {
          return toast.error("Product not found in database.");
        }
  
        removeFromBasket(item.id);
      }
  
      toast.success(method === "online" ? "Online payment successful!" : "Payment on delivery confirmed!");
      sendEmail();
      toggleModal("payment", false);
      toggleModal("delivery", false);
      toggleModal("first", false);
  
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
          <Card.Text>Price: {item.price} TND x {item.quantity} = {item.price * item.quantity} TND</Card.Text>
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
          <h4 className="text-right mt-4">Total: {calculateTotal()} TND</h4>
          <Button className="mt-3 w-100" onClick={() => toggleModal("first", true)} disabled={basket.some(item => item.amount === 0)}>
            Checkout
          </Button>

          {["first", "payment", "delivery"].map((type) => (
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
                        type="password"  
                        placeholder="Card Code"
                        value={paymentDetails.cardCode}
                        onChange={(e) => updatePaymentDetails("cardCode", e.target.value)}
                      />
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <FormControl
                        placeholder="Expiration Date"
                        value={paymentDetails.expirationDate}
                        onChange={(e) => updatePaymentDetails("expirationDate", e.target.value)}
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
