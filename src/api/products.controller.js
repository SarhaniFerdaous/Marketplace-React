const express = require('express');
const admin = require('firebase-admin');
const db = admin.firestore();
const router = express.Router();

// Endpoint to search for products
router.get("/api/products", async (req, res) => {
  const { search, type } = req.query;
  
  if (!search) {
    return res.status(400).send("Search query is required");
  }

  try {
    // Query Firestore for products matching the search text in the searchKeywords field
    const productsRef = db.collection("products");
    const snapshot = await productsRef
      .where("productType", "==", type) // Filter by product type (optional)
      .get();

    const matchedProducts = [];

    snapshot.forEach((doc) => {
      const product = doc.data();
      if (product.searchKeywords && product.searchKeywords.some(keyword => keyword.includes(search.toLowerCase()))) {
        matchedProducts.push({ id: doc.id, ...product });
      }
    });

    if (matchedProducts.length === 0) {
      return res.status(404).send("No products found.");
    }

    res.json(matchedProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Error fetching products.");
  }
});

// Endpoint to process the order and save delivery information if "Payment on Delivery"
router.post("/api/orders", async (req, res) => {
  const { paymentMethod, deliveryAddress, phoneNumber, otherOrderDetails } = req.body;

  // Check if payment method is 'Payment on Delivery'
  if (paymentMethod === 'Payment on Delivery') {
    try {
      // Save the order with delivery address and phone number in the 'vente' collection
      const venteRef = db.collection('vente').doc(); // Creates a new document in the 'vente' collection
      await venteRef.set({
        ...otherOrderDetails,
        paymentMethod,
        deliveryAddress,
        phoneNumber,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });

      res.status(201).send('Order saved successfully!');
    } catch (error) {
      console.error('Error saving order:', error);
      res.status(500).send('Error saving order.');
    }
  } else {
    res.status(400).send('Invalid payment method.');
  }
});

module.exports = router;
