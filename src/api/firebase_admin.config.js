const admin = require("firebase-admin");
const dotenv = require("dotenv");

// Load environment variables from a .env file
dotenv.config();

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
    // Uncomment this line if using Realtime Database
    // databaseURL: process.env.FIREBASE_DATABASE_URL, 
  });
}

// Initialize Firestore database instance
const db = admin.firestore();

// Example of adding a new document to Firestore (for products)
const addProduct = async (product) => {
  try {
    const docRef = await db.collection("products").add(product);
    console.log("Product added with ID:", docRef.id);
  } catch (error) {
    console.error("Error adding product: ", error);
  }
};

// Example of getting all products from Firestore
const getProducts = async () => {
  try {
    const snapshot = await db.collection("products").get();
    snapshot.forEach((doc) => {
      console.log(doc.id, '=>', doc.data());
    });
  } catch (error) {
    console.error("Error getting products: ", error);
  }
};

// Example of updating a product in Firestore
const updateProduct = async (productId, updatedData) => {
  try {
    const productRef = db.collection("products").doc(productId);
    await productRef.update(updatedData);
    console.log("Product updated");
  } catch (error) {
    console.error("Error updating product: ", error);
  }
};

// Example of deleting a product from Firestore
const deleteProduct = async (productId) => {
  try {
    await db.collection("products").doc(productId).delete();
    console.log("Product deleted");
  } catch (error) {
    console.error("Error deleting product: ", error);
  }
};

// User Management Functions

// Add a new user to Firestore
const addUser = async (user) => {
  try {
    const docRef = await db.collection("users").add(user);
    console.log("User added with ID:", docRef.id);
  } catch (error) {
    console.error("Error adding user: ", error);
  }
};

// Get all users from Firestore
const getUsers = async () => {
  try {
    const snapshot = await db.collection("users").get();
    snapshot.forEach((doc) => {
      console.log(doc.id, '=>', doc.data());
    });
  } catch (error) {
    console.error("Error getting users: ", error);
  }
};

// Update user details in Firestore
const updateUser = async (userId, updatedData) => {
  try {
    const userRef = db.collection("users").doc(userId);
    await userRef.update(updatedData);
    console.log("User updated");
  } catch (error) {
    console.error("Error updating user: ", error);
  }
};

// Delete a user from Firestore
const deleteUser = async (userId) => {
  try {
    await db.collection("users").doc(userId).delete();
    console.log("User deleted");
  } catch (error) {
    console.error("Error deleting user: ", error);
  }
};

// Export Firestore database and operations
module.exports = {
  db,
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  addUser,
  getUsers,
  updateUser,
  deleteUser,
};
