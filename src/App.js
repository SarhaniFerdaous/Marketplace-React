import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { BasketProvider } from "./context/BasketContext";
import { ToastContainer } from 'react-toastify';
import Header from './composants/header';
import NavBar from './composants/navbar'; 
import Home from './composants/home'; 
import Register from './composants/Register'; 
import Signin from './composants/Signin'; 
import Footer from './composants/footer'; 
import AddProductForm from './composants/ajouterProduits'; 
import PCPage from './composants/PCPage'; 
import EcranPage from './composants/EcranPage'; 
import ChairGamerPage from './composants/ChairGamerPage'; 
import ProductList from './composants/ProductList'; 
import Panier from './composants/panier'; 
import UserProfile from './composants/profile'; 
import AdminPage from './composants/AdminPage'; // Import your AdminPage component
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <BasketProvider>
      <Router>
        <div className="App layout-container">
          <ToastContainer />
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
              <Route path="/profile" element={<UserProfile/>} />
              <Route path="*" element={<div>404 Not Found</div>} />
              <Route path="/AdminPage" element={<AdminPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </BasketProvider>
  );
};

export default App;
