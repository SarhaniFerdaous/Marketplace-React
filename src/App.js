import React, { useEffect, useState } from 'react'; 
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { BasketProvider } from "./context/BasketContext";
import { ToastContainer } from 'react-toastify';
import { logEvent } from 'firebase/analytics';
import { getAnalytics } from 'firebase/analytics'; 
import Header from './composants/header';
import NavBar from './composants/navbar'; 
import Home from './composants/home'; 
import Register from './composants/Register'; 
import Signin from './composants/Signin'; 
import Footer from './composants/footer'; 
import AddProductForm from './composants/ajouterProduits'; 
import PCPage from './composants/PCPage'; 
import AccessoriesPage from './composants/accessoriesPage'; 
import ChairGamerPage from './composants/ChairGamerPage'; 
import ProductList from './composants/ProductList'; 
import Panier from './composants/panier'; 
import UserProfile from './composants/profile'; 
import AdminPage from './composants/AdminPage';
import Categories from './composants/categories'; 
import SearchPage from './composants/searchPage';
import Dashboard from './composants/Dashboard';
import LoadingPage from "./composants/loadingScreen"; 
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [isPageLoaded, setIsPageLoaded] = useState(false); 

  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  useEffect(() => {
    const analytics = getAnalytics(); 
    logEvent(analytics, 'notification_received'); 
  }, []); 

  return (
    <BasketProvider>
      <Router>
        <div className="App layout-container">
          <ToastContainer />
          <Header />
          <NavBar />
          <main className="content">
            <Routes>
              <Route path="/register" element={<Register />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/pc" element={<PCPage />} />
              <Route path="/accessories" element={<AccessoriesPage />} />
              <Route path="/chair-gamer" element={<ChairGamerPage />} />
              <Route path="/PC" element={<ProductList productType="PC" />} />
              <Route path="/Ecran" element={<ProductList productType="Ecran" />} />
              <Route path="/ChairGamer" element={<ProductList productType="Chair Gamer" />} />
              <Route path="/ajouterProduits" element={<AddProductForm />} />
              <Route path="/panier" element={<Panier />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/AdminPage" element={<AdminPage />} />
              <Route path="/search/:searchText" element={<Home />} />
              <Route path="/categories" element={<Categories />} /> 
              <Route path="/search" element={<SearchPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/loading" element={<LoadingPage />} />
              <Route path="/" exact element={isPageLoaded ? <Home /> : <LoadingPage />} />
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
