import React, { useContext } from "react";
import { Row, Col, Card, InputGroup, Button, FormControl } from "react-bootstrap"; // Import Bootstrap components
import { FaTrashAlt } from "react-icons/fa"; // Import the trash icon from react-icons
import { BasketContext } from "../context/BasketContext";

const Panier = () => {
  const { basket, updateQuantity, removeFromBasket } = useContext(BasketContext);

  const calculateTotal = () =>
    basket.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Panier</h2>
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
                        onClick={() => updateQuantity(item.id, -1)}
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
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        +
                      </Button>
                    </InputGroup>
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
        </div>
      )}
    </div>
  );
};

export default Panier;
