import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "../api/firebase.config"; 
import { toast, ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 

const Footer = () => {
  const [paragraph, setParagraph] = useState(""); 
  const navigate = useNavigate(); 
  const handleSubmit = async () => {
    const user = auth.currentUser; 

    
    if (!user) {
      toast.warning("Please log in to submit your recommendation.", {
        position: "top-center",
        autoClose: 3000,
      });
      navigate("/register"); 
      return;
    }

   
    if (paragraph.trim() === "") {
      toast.error("Please type in a recommendation before submitting.", {
        position: "top-center", 
        autoClose: 3000,
      });
      return;
    }

    try {
      
      await addDoc(collection(db, "recommendations"), {
        userId: user.uid, 
        recommendation: paragraph.trim(), 
      });
      toast.success("Your recommendation has been submitted successfully!", {
        position: "top-center", 
        autoClose: 3000,
      });
      setParagraph(""); 
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error("An error occurred. Please try again.", {
        position: "top-center", 
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
      position: "relative", 
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
    copyrightContainer: {
      marginTop: "20px", 
      padding: "5px 0", 
      borderTop: "1px solid #e0e0e0", 
      backgroundColor: "#343a40",
      textAlign: "center",
    },
    copyright: {
      fontSize: "10px", 
      color: "#ffffff", 
    }
  };
  
  return (
    <>
      <footer style={styles.footer}>
        <div style={styles.row}>
   
          <div style={styles.column}>
            <h5 style={styles.header}>Contact</h5>
            <div>
              <p><i className="fas fa-phone"></i> (+216) 23 606 003</p>
              <p><i className="fas fa-phone"></i> (+216) 20 162 414</p>
              <p><i className="fas fa-envelope"></i> infozone.devis@gmail.com</p>
            </div>
          </div>
  
          
          <div style={styles.column}>
            <h5 style={styles.header}>Recommendations</h5>
            <p>There is always room for improvements !</p>
            <div style={styles.inputGroup}>
              <input
                type="text"
                placeholder="Your recommendation"
                value={paragraph}
                onChange={(e) => setParagraph(e.target.value)} 
                style={styles.input}
              />
              <button onClick={handleSubmit} style={styles.button}>Submit</button>
            </div>
          </div>
        </div>
        
       
        <div style={styles.copyrightContainer}>
          <div style={styles.copyright}>
            Copyright © 2024-present InfoZone, Inc. All rights reserved.
          </div>
        </div>
      </footer>
      <ToastContainer /> 
    </>
  );
  
};

export default Footer;
