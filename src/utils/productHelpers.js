import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

/**
 * Utility function to generate search keywords for a product.
 * These keywords include prefixes and combinations of name, brand, description, and productId.
 * 
 * @param {string} productId - The unique product ID to retrieve from Firestore.
 * @returns {Promise<void>} A promise that resolves once the keywords are added to Firestore.
 */
export const generateSearchKeywords = async (productId) => {
  const db = getFirestore();
  const productDocRef = doc(db, "products", productId); // Reference to the product document

  try {
    const productDoc = await getDoc(productDocRef); // Fetch the product data from Firestore

    if (!productDoc.exists()) {
      console.error("Product not found!");
      return;
    }

    const productData = productDoc.data();
    const { name, brand, description } = productData;

    // Create a set to store keywords and ensure uniqueness
    const keywords = new Set();

    // Helper function to create all substrings of a given text.
    const generateSubstrings = (text) => {
      const words = text.toLowerCase().split(" ");
      for (const word of words) {
        let current = "";
        for (const char of word) {
          current += char;
          keywords.add(current); // Add prefix-based substrings
        }
      }
    };

    // Process name, brand, description, and productId
    if (name) generateSubstrings(name);
    if (brand) generateSubstrings(brand);
    if (description) generateSubstrings(description);
    if (productId) keywords.add(productId.toLowerCase()); // Add productId as a keyword

    // Add full strings for name, brand, description
    if (name) keywords.add(name.toLowerCase());
    if (brand) keywords.add(brand.toLowerCase());
    if (description) keywords.add(description.toLowerCase());
    if (productId) keywords.add(productId);

    // Convert Set to Array and add the keywords field to the document
    const keywordArray = Array.from(keywords);

    // Update the product document with the new keywords
    await setDoc(productDocRef, { searchKeywords: keywordArray }, { merge: true });

    console.log("Keywords added to product:", keywordArray);

  } catch (error) {
    console.error("Error fetching product from Firestore:", error);
  }
};
