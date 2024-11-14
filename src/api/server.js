const express = require("express");
const cors = require("cors");
const db = require("./firebase-admin.config"); // Import Firestore instance

const app = express();
app.use(cors());
app.use(express.json());

// Valid categories (optional enhancement)
const VALID_CATEGORIES = ["PC", "Ecran", "Chair Gaming"];

// API endpoint to get products by category
app.get("/products", async (req, res) => {
  try {
    // Query all products
    const productsRef = db.collection("products");
    const snapshot = await productsRef.get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "No products found" });
    }

    // Organize products by category
    const productsByCategory = {};
    snapshot.forEach((doc) => {
      const product = doc.data();
      const category = product.productType || "Uncategorized"; // Default to 'Uncategorized'

      if (!productsByCategory[category]) {
        productsByCategory[category] = [];
      }

      productsByCategory[category].push({ id: doc.id, ...product });
    });

    res.json(productsByCategory); // Send the products grouped by category
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// API endpoint to get products by specific category
app.get("/products/:category", async (req, res) => {
  const category = req.params.category;

  // Check if category is valid
  if (!VALID_CATEGORIES.includes(category)) {
    return res.status(400).json({ message: `Invalid category: ${category}` });
  }

  try {
    // Query products by category (productType)
    const productsRef = db.collection("products").where("productType", "==", category);
    const snapshot = await productsRef.get();

    if (snapshot.empty) {
      return res.status(404).json({ message: `No products found for category: ${category}` });
    }

    const products = [];
    snapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });

    res.json(products); // Send the products for the specific category
  } catch (error) {
    console.error("Error retrieving products by category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
