import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // To handle redirection
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "../api/firebase.config"; 
import { toast, ToastContainer } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS

const Footer = () => {
  const [paragraph, setParagraph] = useState(""); // State to hold the recommendation
  const navigate = useNavigate(); // Hook to handle navigation

  const handleSubmit = async () => {
    const user = auth.currentUser; // Get the currently authenticated user

    // Redirect to registration page if the user is not logged in
    if (!user) {
      toast.warning("Please log in to submit your recommendation.", {
        position: "top-center", // Correctly use the string
        autoClose: 3000,
      });
      navigate("/register"); // Adjust the path to match your registration page route
      return;
    }

    // Validate that the input is not empty
    if (paragraph.trim() === "") {
      toast.error("Please type in a recommendation before submitting.", {
        position: "top-center", // Correctly use the string
        autoClose: 3000,
      });
      return;
    }

    try {
      // Add the recommendation to the Firestore 'recommendations' collection
      await addDoc(collection(db, "recommendations"), {
        userId: user.uid, // Link the recommendation to the user's UID
        recommendation: paragraph.trim(), // Save the recommendation text
      });
      toast.success("Your recommendation has been submitted successfully!", {
        position: "top-center", // Correctly use the string
        autoClose: 3000,
      });
      setParagraph(""); // Clear the input field after submission
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error("An error occurred. Please try again.", {
        position: "top-center", // Correctly use the string
        autoClose: 3000,
      });
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
  };

  return (
    <>
      <footer style={styles.footer}>
        <div style={styles.row}>
          {/* Information Section */}
          <div style={styles.column}>
            <h5 style={styles.header}>InfoZone</h5>
            <ul>
              <li><a href="#" style={{ color: "#007bff" }}>About Us</a></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div style={styles.column}>
            <h5 style={styles.header}>Contact</h5>
            <div>
              <p><i className="fas fa-phone"></i> (+216) 23 606 003</p>
              <p><i className="fas fa-phone"></i> (+216) 20 162 414</p>
              <p><i className="fas fa-envelope"></i> infozone.devis@gmail.com</p>
            </div>
          </div>

          {/* Recommendations Section */}
          <div style={styles.column}>
            <h5 style={styles.header}>Recommendations</h5>
            <p>There is always room for improvement ❤️</p>
            <div style={styles.inputGroup}>
              <input
                type="text"
                placeholder="Your recommendation"
                value={paragraph}
                onChange={(e) => setParagraph(e.target.value)} // Update the paragraph state
                style={styles.input}
              />
              <button onClick={handleSubmit} style={styles.button}>Submit</button>
            </div>
          </div>
        </div>
      </footer>
      <ToastContainer /> {/* Include the ToastContainer for notifications */}
    </>
  );
};

export default Footer;
