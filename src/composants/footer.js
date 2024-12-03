import React from "react";
import ppImage from "../photo/pp.png"; // Import the image

const Footer = () => {
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
          <h5 style={styles.header}>Newsletter</h5>
          <div>
            <p>Recevez nos mises à jour</p>
            <div style={styles.inputGroup}>
              <input
                type="email"
                placeholder="Votre email"
                style={styles.input}
              />
              <button style={styles.button}>Souscrire</button>
            </div>
          </div>
        </div>

       
      </div>
    </footer>
  );
};

export default Footer;
