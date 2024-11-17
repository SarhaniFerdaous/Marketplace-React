const db = require("./firebase-admin.config");

exports.getProducts = async (req, res) => {
  const { type, search } = req.query;

  try {
    const productsRef = db.collection("products");
    let queryRef = productsRef;

    // Filter by product type if provided
    if (type) queryRef = queryRef.where("productType", "==", type);

    // Perform search on product name or brand if provided
    if (search) {
      const searchLower = search.toLowerCase(); // Normalize search for case insensitivity
      queryRef = queryRef
        .where("searchKeywords", "array-contains", searchLower); // Assuming `searchKeywords` is precomputed
    }

    const snapshot = await queryRef.get();
    const productsByCategory = {};

    snapshot.forEach((doc) => {
      const product = doc.data();
      const category = product.productType || "Uncategorized";

      if (!productsByCategory[category]) productsByCategory[category] = [];
      productsByCategory[category].push({ id: doc.id, ...product });
    });

    res.json(productsByCategory); // Return products grouped by category
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
