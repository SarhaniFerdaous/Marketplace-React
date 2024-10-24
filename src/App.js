import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './composants/header';
import NavBar from './composants/navbar';
import Home from './composants/home'; // Ensure Home is imported correctly
import Register from './composants/Register'; // Ensure this import is present
import Footer from './composants/footer';
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
            <Route path="/" element={<Home />} /> {/* This route points to Home.js */}
            <Route path="/register" element={<Register />} />
            <Route path="/pcs" element={<div>PCs Page</div>} />
            <Route path="/ordinateurs" element={<div>Ordinateurs Page</div>} />
            <Route path="/accessoires" element={<div>Accessoires Page</div>} />
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
