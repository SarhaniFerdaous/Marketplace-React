import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './composants/header';
import NavBar from './composants/navbar';
import Home from './composants/home';
import Register from './composants/Register';
import Signin from './composants/Signin';
import Footer from './composants/footer';
import AddProductForm from './composants/ajouterProduits'; // Import the AddProductForm component
import PCPage from './composants/PCPage'; // Import PCPage component
import EcranPage from './composants/EcranPage'; // Import EcranPage component
import ChairGamerPage from './composants/ChairGamerPage'; // Import ChairGamerPage component

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
            <Route path="/pc" element={<PCPage />} /> {/* Corrected route for PC */}
            <Route path="/ecran" element={<EcranPage />} /> {/* Corrected route for Ecran */}
            <Route path="/chair-gamer" element={<ChairGamerPage />} /> {/* Corrected route for Chair Gamer */}
            <Route path="/ajouterProduits" element={<AddProductForm />} /> {/* New route for AddProductForm */}
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
