import React, { useState } from "react";

const Cart = () => {
    const initialCartItems = [
        { id: 1, name: "PC Portable", price: 999.99, quantity: 1, image: "https://via.placeholder.com/60" },
        { id: 2, name: "Écran", price: 199.99, quantity: 1, image: "https://via.placeholder.com/60" },
        { id: 3, name: "Chaise Gamer", price: 150.00, quantity: 1, image: "https://via.placeholder.com/60" }
    ];

    const [cartItems, setCartItems] = useState(initialCartItems);

    const changeQuantity = (index, amount) => {
        const newCartItems = [...cartItems];
        if (newCartItems[index].quantity + amount > 0) {
            newCartItems[index].quantity += amount;
            setCartItems(newCartItems);
        }
    };

    const getTotal = () => {
        return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);
    };

    // Styles en ligne pour le composant
    const styles = {
        container: {
            width: "80%",
            maxWidth: "800px",
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            fontFamily: "Arial, sans-serif",
            margin: "20px auto",
        },
        title: {
            fontSize: "24px",
            marginBottom: "20px",
            textAlign: "center",
        },
        cartItems: {
            borderTop: "1px solid #ddd",
            paddingTop: "20px",
            marginBottom: "20px",
        },
        cartItem: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "15px 0",
            borderBottom: "1px solid #ddd",
        },
        itemImage: {
            width: "60px",
            height: "60px",
            objectFit: "cover",
            borderRadius: "4px",
        },
        itemInfo: {
            flex: 1,
            padding: "0 15px",
        },
        itemName: {
            fontSize: "18px",
            marginBottom: "5px",
        },
        itemQuantity: {
            display: "flex",
            alignItems: "center",
        },
        quantityBtn: {
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            padding: "5px 10px",
            cursor: "pointer",
            borderRadius: "4px",
            margin: "0 5px",
        },
        cartSummary: {
            textAlign: "right",
            fontSize: "18px",
            marginTop: "20px",
        },
        checkoutBtn: {
            marginTop: "10px",
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
        },
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Votre Panier</h1>
            <div style={styles.cartItems}>
                {cartItems.map((item, index) => (
                    <div style={styles.cartItem} key={item.id}>
                        <img src={item.image} alt={item.name} style={styles.itemImage} />
                        <div style={styles.itemInfo}>
                            <h4 style={styles.itemName}>{item.name}</h4>
                            <p>{item.price.toFixed(2)} €</p>
                        </div>
                        <div style={styles.itemQuantity}>
                            <button style={styles.quantityBtn} onClick={() => changeQuantity(index, -1)}>-</button>
                            <span>{item.quantity}</span>
                            <button style={styles.quantityBtn} onClick={() => changeQuantity(index, 1)}>+</button>
                        </div>
                        <p>{(item.price * item.quantity).toFixed(2)} €</p>
                    </div>
                ))}
            </div>
            <div style={styles.cartSummary}>
                <p>Total : <span>{getTotal()} €</span></p>
                <button style={styles.checkoutBtn}>Passer à la Caisse</button>
            </div>
        </div>
    );
};

export default Cart;
