import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './composants/header';
import NavBar from './composants/navbar';
import Home from './composants/home';
import Register from './composants/Register';
import Signin from './composants/Signin';
import Footer from './composants/footer';
import AddProductForm from './composants/ajouterProduits'; // Import the AddProductForm component

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <Router>
      <div className="App layout-container">
        <Header />
        <NavBar />
        <main className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/Signin" element={<Signin />} />
            <Route path="/pcs" element={<div>PCs Page</div>} />
            <Route path="/ordinateurs" element={<div>Ordinateurs Page</div>} />
            <Route path="/accessoires" element={<div>Accessoires Page</div>} />
            <Route path="/ajouterProduits" element={<AddProductForm />} /> {/* New route */}
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
