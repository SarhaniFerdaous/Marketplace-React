import React, { useState, useEffect } from "react";
import { Card, Button, Row, Col, Modal } from "react-bootstrap";
import { FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { fetchUserProducts, deleteProduct } from "../api/profile.fetch"; // Adjust import if necessary

const UserProfile = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserProducts = async () => {
      try {
        const data = await fetchUserProducts(); // No need to pass userId, API handles it
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        toast.error(`Failed to fetch products: ${err.message}`);
        console.error(err);
      }
    };

    loadUserProducts();
  }, []); // Empty dependency array means this runs once when the component mounts

  const handleRemoveProduct = async (productId) => {
    try {
      const result = await deleteProduct(productId); // API call to delete product
      if (result) {
        // Remove the deleted product from the state
        setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId));
        toast.success("Product removed successfully.");
      } else {
        toast.error("Product removal failed.");
      }
    } catch (err) {
      toast.error("Error removing product.");
      console.error(err); // Log any error
    }
  };
  

  return (
    <div style={{ padding: "20px" }}>
      <h2>My products</h2>
      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products added yet.</p>
      ) : (
        <Row>
          {products.map((product) => (
            <Col key={product.id} sm={12} md={6} lg={4}>
              <Card style={{ marginBottom: "20px", border: "1px solid #e0e0e0" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#f8f8f8",
                    padding: "10px",
                    height: "200px",
                  }}
                >
                  <Card.Img
                    variant="top"
                    src={product.imageUrl}
                    alt={product.description}
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
                    <Card.Title>{product.description}</Card.Title>
                    <FaTrashAlt
                      style={{
                        color: "#e74c3c",
                        cursor: "pointer",
                        fontSize: "18px",
                      }}
                      onClick={() => {
                        setProductToDelete(product.id);
                        setShowModal(true);
                      }}
                    />
                  </div>
                  <Card.Text>Price: ${product.price}</Card.Text>
                  <Card.Text>Quantity: {product.quantity}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Modal for Product Removal Confirmation */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this product from your profile?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              handleRemoveProduct(productToDelete);
              setShowModal(false);
            }}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserProfile;
