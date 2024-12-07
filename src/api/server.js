const express = require("express");
const cors = require("cors");
const db = require("./firebase-admin.config");  

const app = express();
app.use(cors());
app.use(express.json());


const VALID_CATEGORIES = ["PC", "Ecran", "Chair Gaming"];


app.get("/products", async (req, res) => {
  try {
  
    const productsRef = db.collection("products");
    const snapshot = await productsRef.get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "No products found" });
    }

    
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


app.get("/products/:category", async (req, res) => {
  const category = req.params.category;

 
  if (!VALID_CATEGORIES.includes(category)) {
    return res.status(400).json({ message: `Invalid category: ${category}` });
  }

  try {
   
    const productsRef = db.collection("products").where("productType", "==", category);
    const snapshot = await productsRef.get();

    if (snapshot.empty) {
      return res.status(404).json({ message: `No products found for category: ${category}` });
    }

    const products = [];
    snapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });

    res.json(products); 
  } catch (error) {
    console.error("Error retrieving products by category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
