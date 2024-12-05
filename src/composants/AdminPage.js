import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../api/firebase.config'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [ventes, setVentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'user' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productCollection = collection(db, 'products');
        const userCollection = collection(db, 'users');
        const ventesCollection = collection(db, 'ventes');
  
        const productSnapshot = await getDocs(productCollection);
        const userSnapshot = await getDocs(userCollection);
        const ventesSnapshot = await getDocs(ventesCollection);
  
        setProducts(productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setUsers(userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setVentes(ventesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      } catch (error) {
        toast.error('Error fetching data');
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);

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

  // Map product IDs to their brand names
  const getProductBrand = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.brand : 'Unknown Brand';
  };

  // Helper function to split products into pairs for display
  const chunkProducts = (products) => {
    const chunks = [];
    for (let i = 0; i < products.length; i += 2) {
      chunks.push(products.slice(i, i + 2));
    }
    return chunks;
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
            <div style={styles.productsGrid}>
              {chunkProducts(products).map((productPair, index) => (
                <div key={index} style={styles.productRow}>
                  {productPair.map((product) => (
                    <div key={product.id} style={styles.productItem}>
                      <strong>{product.name}</strong>
                      <p>{product.description}</p>
                      <button style={styles.deleteButton} onClick={() => handleDeleteProduct(product.id)}>
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
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

          {/* Ventes Table without delete button */}
          <section style={styles.section}>
            <h2>Manage Ventes</h2>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Brand</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {ventes.map((vente) => (
                  <tr key={vente.id} style={styles.tableRow}>
                    <td>{getProductBrand(vente.productId)}</td>
                    <td>{vente.quantity}</td>
                    <td>{vente.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
    minHeight: '400px',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' },
  input: { padding: '12px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ddd', transition: 'border-color 0.3s' },
  addButton: { 
    padding: '12px 20px',
    fontSize: '16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  button: { 
    padding: '6px 12px', 
    backgroundColor: '#f39c12', 
    color: 'white', 
    border: 'none', 
    borderRadius: '4px', 
    cursor: 'pointer',
  },
  deleteButton: { 
    padding: '6px 12px', 
    backgroundColor: '#e74c3c', 
    color: 'white', 
    border: 'none', 
    borderRadius: '4px', 
    cursor: 'pointer',
  },
  productsGrid: {
    display: 'flex', 
    flexWrap: 'wrap', 
    gap: '20px',
  },
  productRow: {
    display: 'flex', 
    gap: '20px',
    justifyContent: 'space-between',
    width: '100%',
  },
  productItem: { 
    flex: '1', 
    padding: '20px', 
    border: '1px solid #ddd', 
    borderRadius: '8px', 
    backgroundColor: '#f9f9f9',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)', 
  },
  table: { 
    width: '100%', 
    borderCollapse: 'collapse', 
    marginTop: '20px',
  },
  tableRow: { 
    borderBottom: '1px solid #ddd', 
  },
  list: { listStyleType: 'none', padding: '0' },
  listItem: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    padding: '10px 0', 
    borderBottom: '1px solid #ddd',
  },
};

export default AdminPage;
