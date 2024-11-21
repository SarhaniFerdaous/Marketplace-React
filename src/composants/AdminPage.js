import React, { useState, useEffect } from 'react';
import { addUser, updateUser, deleteUser, addProduct, updateProduct, deleteProduct, getProducts, getUsers } from '../api/firebase_admin.config';


const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', quantity: '' });
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'user' });

  useEffect(() => {
    // Fetch products and users when the page loads
    const fetchData = async () => {
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
    };

    fetchData();
  }, []);

  // Handle Product Form Submission
  const handleAddProduct = async () => {
    try {
      await addProduct(newProduct);
      setNewProduct({ name: '', description: '', price: '', quantity: '' });
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  // Handle User Form Submission
  const handleAddUser = async () => {
    try {
      await addUser(newUser);
      setNewUser({ name: '', email: '', role: 'user' });
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  // Handle Product Update
  const handleUpdateProduct = async (productId, updatedData) => {
    try {
      await updateProduct(productId, updatedData);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  // Handle User Update
  const handleUpdateUser = async (userId, updatedData) => {
    try {
      await updateUser(userId, updatedData);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // Handle Product Deletion
  const handleDeleteProduct = async (productId) => {
    try {
      await deleteProduct(productId);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Handle User Deletion
  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div style={styles.adminPage}>
      <h1>Admin Dashboard</h1>

      <div style={styles.adminSection}>
        <h2>Manage Products</h2>
        <form onSubmit={e => e.preventDefault()}>
          <input
            style={styles.input}
            type="text"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
          />
          <input
            style={styles.input}
            type="text"
            placeholder="Description"
            value={newProduct.description}
            onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
          />
          <input
            style={styles.input}
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
          />
          <input
            style={styles.input}
            type="number"
            placeholder="Quantity"
            value={newProduct.quantity}
            onChange={e => setNewProduct({ ...newProduct, quantity: e.target.value })}
          />
          <button style={styles.button} type="button" onClick={handleAddProduct}>Add Product</button>
        </form>

        <h3>Existing Products</h3>
        <ul style={styles.list}>
          {products.map(product => (
            <li key={product.id} style={styles.listItem}>
              <div style={styles.productItem}>
                <p>Name: {product.name}</p>
                <p>Description: {product.description}</p>
                <p>Price: {product.price}</p>
                <p>Quantity: {product.quantity}</p>
                <button style={styles.button} onClick={() => handleUpdateProduct(product.id, { price: 100 })}>Update</button>
                <button style={styles.button} onClick={() => handleDeleteProduct(product.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div style={styles.adminSection}>
        <h2>Manage Users</h2>
        <form onSubmit={e => e.preventDefault()}>
          <input
            style={styles.input}
            type="text"
            placeholder="User Name"
            value={newUser.name}
            onChange={e => setNewUser({ ...newUser, name: e.target.value })}
          />
          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={e => setNewUser({ ...newUser, email: e.target.value })}
          />
          <select
            style={styles.input}
            value={newUser.role}
            onChange={e => setNewUser({ ...newUser, role: e.target.value })}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button style={styles.button} type="button" onClick={handleAddUser}>Add User</button>
        </form>

        <h3>Existing Users</h3>
        <ul style={styles.list}>
          {users.map(user => (
            <li key={user.id} style={styles.listItem}>
              <div style={styles.userItem}>
                <p>Name: {user.name}</p>
                <p>Email: {user.email}</p>
                <p>Role: {user.role}</p>
                <button style={styles.button} onClick={() => handleUpdateUser(user.id, { role: 'admin' })}>Make Admin</button>
                <button style={styles.button} onClick={() => handleDeleteUser(user.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const styles = {
  adminPage: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  adminSection: {
    marginBottom: '30px',
  },
  input: {
    padding: '8px',
    margin: '5px',
  },
  button: {
    padding: '8px 15px',
    marginTop: '10px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
  buttonHover: {
    backgroundColor: '#45a049',
  },
  list: {
    listStyleType: 'none',
    padding: 0,
  },
  listItem: {
    marginBottom: '15px',
  },
  productItem: {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  userItem: {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
};

export default AdminPage;
