const db = require("./firebase-admin.config");

exports.getProducts = async (req, res) => {
  try {
    const productsRef = db.collection("products");
    const snapshot = await productsRef.get();
    const productsByCategory = {};

    snapshot.forEach((doc) => {
      const product = doc.data();
      const category = product.productType || "Uncategorized";
      if (!productsByCategory[category]) productsByCategory[category] = [];
      productsByCategory[category].push({ id: doc.id, ...product });
    });

    res.json(productsByCategory);
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
