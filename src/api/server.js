const express = require("express");
const cors = require("cors");
const db = require("./firebase-admin.config"); // Import Firestore instance

const app = express();
app.use(cors());
app.use(express.json());

// API endpoint to get products by category
app.get("/products", async (req, res) => {
  try {
    const productsRef = db.collection("products");
    const snapshot = await productsRef.get();

    if (snapshot.empty) {
      res.status(404).json({ message: "No products found" });
      return;
    }

    // Organize products by category
    const productsByCategory = {};
    snapshot.forEach((doc) => {
      const product = doc.data();
      const category = product.productType || "Uncategorized";

      if (!productsByCategory[category]) {
        productsByCategory[category] = [];
      }

      productsByCategory[category].push({ id: doc.id, ...product });
    });

    res.json(productsByCategory);
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
