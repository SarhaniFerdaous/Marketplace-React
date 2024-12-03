import React, { useState } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app"; // Import Firebase App initialization

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAhE8x2BVeEZybkd2Bf25TJZpuXZUzOOVA",
  authDomain: "projet-web-react-e8331.firebaseapp.com",
  projectId: "projet-web-react-e8331",
  storageBucket: "projet-web-react-e8331.appspot.com",
  messagingSenderId: "231353239135",
  appId: "1:231353239135:web:1fd15a4be10586acd4bdea"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig); // Initialize Firebase app

const Footer = () => {
  const [paragraph, setParagraph] = useState(""); // State to hold the paragraph input
  const [error, setError] = useState(""); // State to hold error messages
  const db = getFirestore(firebaseApp); // Firestore database reference
  const auth = getAuth(firebaseApp); // Firebase Auth reference

  // Function to handle form submission
  const handleSubscribe = async () => {
    const user = auth.currentUser; // Get the currently authenticated user

    // Validate if user is logged in and paragraph is not empty
    if (!user) {
      setError("Veuillez vous connecter avant de vous abonner.");
      return;
    }

    if (paragraph.trim() === "") {
      setError("Veuillez entrer un texte avant de soumettre.");
      return;
    }

    try {
      // Add the paragraph, user's email, and userId to the Firestore 'newsletter' collection
      await addDoc(collection(db, "newsletter"), {
        userId: user.uid, // Store the user's UID
        email: user.email, // Store the user's email
        paragraph: paragraph.trim(), // Store the paragraph entered by the user
      });
      alert("Vous êtes abonné à la newsletter !");
      setParagraph(""); // Clear the input field after submission
      setError(""); // Reset the error message
    } catch (error) {
      console.error("Error adding document: ", error);
      setError("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  const styles = {
    footer: {
      backgroundColor: "#D7D3BF",
      padding: "20px",
      borderTop: "1px solid #e0e0e0",
      fontSize: "14px",
    },
    row: {
      display: "flex",
      flexWrap: "wrap",
      gap: "20px",
      justifyContent: "space-between",
    },
    column: {
      flex: "1 1 calc(25% - 20px)",
      minWidth: "200px",
    },
    header: {
      fontSize: "1rem",
      marginBottom: "10px",
      fontWeight: "bold",
      color: "#343a40",
    },
    list: {
      listStyle: "none",
      padding: 0,
      margin: 0,
    },
    listItem: {
      marginBottom: "8px",
    },
    link: {
      color: "#007bff",
      textDecoration: "none",
      transition: "color 0.3s",
    },
    linkHover: {
      color: "#0056b3",
    },
    inputGroup: {
      display: "flex",
      marginTop: "10px",
    },
    input: {
      flex: 1,
      padding: "8px",
      border: "1px solid #ced4da",
      borderRadius: "4px 0 0 4px",
    },
    button: {
      padding: "8px 12px",
      backgroundColor: "#28a745",
      border: "none",
      color: "white",
      borderRadius: "0 4px 4px 0",
      cursor: "pointer",
    },
    error: {
      color: "red",
      fontSize: "12px",
      marginTop: "10px",
    },
    contactInfo: {
      lineHeight: "1.5",
    },
    paymentIcons: {
      display: "flex",
      marginTop: "10px",
      alignItems: "center",
    },
    paymentImage: {
      height: "40px",
      width: "auto",
    },
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.row}>
        {/* Information Section */}
        <div style={styles.column}>
          <h5 style={styles.header}>InfoZone</h5>
          <ul style={styles.list}>
            {["À propos", "Politique de Confidentialité", "Contact"].map((item) => (
              <li key={item} style={styles.listItem}>
                <a href="#" style={styles.link}>
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Section */}
        <div style={styles.column}>
          <h5 style={styles.header}>Contact</h5>
          <div style={styles.contactInfo}>
            <p><i className="fas fa-phone"></i> (+216) 23 606 003</p>
            <p><i className="fas fa-phone"></i> (+216) 20 162 414</p>
            <p><i className="fas fa-envelope"></i> infozone.devis@gmail.com</p>
          </div>
        </div>

        {/* Newsletter Section */}
        <div style={styles.column}>
          <h5 style={styles.header}>Réclamation </h5>
          <div>
            <p>There is always room for improvment ! Send your reclamations ❤️</p>
            <div style={styles.inputGroup}>
              <input
                type="text"
                placeholder="your message"
                value={paragraph}
                onChange={(e) => setParagraph(e.target.value)} // Update the paragraph state
                style={styles.input}
              />
              <button onClick={handleSubscribe} style={styles.button}>Submit</button>
            </div>
            {error && <p style={styles.error}>{error}</p>}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
