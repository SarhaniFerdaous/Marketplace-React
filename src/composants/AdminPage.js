import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../api/firebase.config'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'user' });

  // Fetch data from Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productCollection = collection(db, 'products');
        const userCollection = collection(db, 'users');

        const productSnapshot = await getDocs(productCollection);
        const userSnapshot = await getDocs(userCollection);

        setProducts(productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setUsers(userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        setLoading(false);
      } catch (error) {
        toast.error('Error fetching data');
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Confirmation for Add User
  const handleAddUser = async () => {
    if (window.confirm('Are you sure you want to add this user?')) {
      try {
        const userCollection = collection(db, 'users');
        await addDoc(userCollection, newUser);
        toast.success('User added successfully');
        setNewUser({ name: '', email: '', role: 'user' });
      } catch (error) {
        toast.error('Error adding user');
        console.error('Error adding user:', error);
      }
    }
  };

  // Confirmation for Update Product
  const handleUpdateProduct = async (id, updatedData) => {
    if (window.confirm('Are you sure you want to update this product?')) {
      try {
        const productDoc = doc(db, 'products', id);
        await updateDoc(productDoc, updatedData);
        toast.success('Product updated successfully');
      } catch (error) {
        toast.error('Error updating product');
        console.error('Error updating product:', error);
      }
    }
  };

  // Confirmation for Update User
  const handleUpdateUser = async (id, updatedData) => {
    if (window.confirm('Are you sure you want to update this user?')) {
      try {
        const userDoc = doc(db, 'users', id);
        await updateDoc(userDoc, updatedData);
        toast.success('User updated successfully');
      } catch (error) {
        toast.error('Error updating user');
        console.error('Error updating user:', error);
      }
    }
  };

  // Confirmation for Delete Product
  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const productDoc = doc(db, 'products', id);
        await deleteDoc(productDoc);
        toast.success('Product deleted successfully');
      } catch (error) {
        toast.error('Error deleting product');
        console.error('Error deleting product:', error);
      }
    }
  };

  // Confirmation for Delete User
  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const userDoc = doc(db, 'users', id);
        await deleteDoc(userDoc);
        toast.success('User deleted successfully');
      } catch (error) {
        toast.error('Error deleting user');
        console.error('Error deleting user:', error);
      }
    }
  };

  return (
    <div style={styles.container}>
      <ToastContainer />
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <div style={styles.adminSections}>
          <section style={styles.section}>
            <h2>Manage Products</h2>
            <ul style={styles.list}>
              {products.map((product) => (
                <li key={product.id} style={styles.listItem}>
                  <strong>{product.name}</strong>
                  <p>{product.description}</p>
                  <button
                    style={styles.button}
                    onClick={() => handleUpdateProduct(product.id, { price: 50 })}
                  >
                    Update Price
                  </button>
                  <button style={styles.deleteButton} onClick={() => handleDeleteProduct(product.id)}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </section>
  
          <section style={styles.section}>
            <h2>Manage Users</h2>
            <form style={styles.form} onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                placeholder="User Name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                style={styles.input}
              />
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                style={styles.input}
              />
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                style={styles.input}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <button style={styles.addButton} onClick={handleAddUser}>
                Add User
              </button>
            </form>
            <ul style={styles.list}>
              {users.map((user) => (
                <li key={user.id} style={styles.listItem}>
                  <strong>{user.name}</strong>
                  <p>{user.email}</p>
                  <button
                    style={styles.button}
                    onClick={() => handleUpdateUser(user.id, { role: 'admin' })}
                  >
                    Make Admin
                  </button>
                  <button style={styles.deleteButton} onClick={() => handleDeleteUser(user.id)}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { 
    padding: '20px', 
    fontFamily: 'Arial, sans-serif', 
    minHeight: '100vh', 
    display: 'flex', 
    flexDirection: 'column',
    justifyContent: 'space-between', 
    maxWidth: '100%',
    margin: '0 auto',
    backgroundColor: '#f4f4f4'
  },
  header: { 
    textAlign: 'center', 
    marginBottom: '40px', 
    fontSize: '36px', 
    color: '#333' 
  },
  adminSections: { 
    display: 'flex',
    gap: '30px',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    flexGrow: 1,
  },
  section: { 
    flex: '1 1 calc(50% - 30px)', 
    marginBottom: '30px',
    padding: '30px',
    border: '1px solid #ddd', 
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    minHeight: '400px',  // Increased size for the section
  },
  form: { display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' },
  input: { padding: '12px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ddd', transition: 'border-color 0.3s' },
  addButton: { 
    padding: '12px 20px',
    fontSize: '16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  button: { 
    padding: '12px 20px',
    fontSize: '16px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  deleteButton: { 
    padding: '12px 20px', 
    fontSize: '16px', 
    backgroundColor: '#f44336', 
    color: 'white', 
    border: 'none', 
    borderRadius: '5px', 
    cursor: 'pointer', 
    transition: 'background-color 0.3s ease',
  },
  list: { 
    listStyleType: 'none', 
    padding: '0', 
    margin: '0',
  },
  listItem: { 
    marginBottom: '20px', 
    padding: '15px', 
    backgroundColor: '#fafafa', 
    borderRadius: '8px', 
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
};

export default AdminPage;
