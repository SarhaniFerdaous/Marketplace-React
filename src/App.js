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
import ProductList from './composants/ProductList'; // Import ProductList

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
            <Route path="/signin" element={<Signin />} />
            <Route path="/pc" element={<PCPage />} /> {/* Route for PC */}
            <Route path="/ecran" element={<EcranPage />} /> {/* Route for Ecran */}
            <Route path="/chair-gamer" element={<ChairGamerPage />} /> {/* Route for Chair Gamer */}
            <Route path="/ajouterProduits" element={<AddProductForm />} /> {/* Route for AddProductForm */}
            <Route path="/PC" element={<ProductList productType="PC" />} /> {/* Route for ProductList filtered by PC */}
            <Route path="/Ecran" element={<ProductList productType="Ecran" />} /> {/* Route for ProductList filtered by Ecran */}
            <Route path="/ChairGamer" element={<ProductList productType="Chair Gamer" />} /> {/* Route for ProductList filtered by Chair Gaming */}
            <Route path="*" element={<div>404 Not Found</div>} /> {/* Catch-all route for 404 */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
