import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { BasketProvider } from "./context/BasketContext";
import Header from './composants/header'; // Header component
import NavBar from './composants/navbar'; // NavBar component
import Home from './composants/home'; // Home component
import Register from './composants/Register'; // Register component
import Signin from './composants/Signin'; // Signin component
import Footer from './composants/footer'; // Footer component
import AddProductForm from './composants/ajouterProduits'; // AddProductForm component
import PCPage from './composants/PCPage'; // PCPage component
import EcranPage from './composants/EcranPage'; // EcranPage component
import ChairGamerPage from './composants/ChairGamerPage'; // ChairGamerPage component
import ProductList from './composants/ProductList'; // ProductList component
import Panier from './composants/panier'; // Panier component


import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <BasketProvider>
    <Router>
      <div className="App layout-container">
        <Header />
        <NavBar />
        <main className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/pc" element={<PCPage />} />
            <Route path="/ecran" element={<EcranPage />} /> 
            <Route path="/chair-gamer" element={<ChairGamerPage />} /> 
            <Route path="/PC" element={<ProductList productType="PC" />} />
            <Route path="/Ecran" element={<ProductList productType="Ecran" />} />
            <Route path="/ChairGamer" element={<ProductList productType="Chair Gamer" />} />
            <Route path="/ajouterProduits" element={<AddProductForm />} />
            <Route path="/panier" element={<Panier />} />
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
    </BasketProvider>
  );
};

export default App;
