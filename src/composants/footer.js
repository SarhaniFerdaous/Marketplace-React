import React from 'react';
import './footer.css'; // Assuming you have footer styles
import ppImage from '../photo/pp.png'; // Import the image

const Footer = () => {
  return (
    <div className="footer">
      <div className="container">
        <div className="row">
          <div className="col-md-3">
            <h5>INFORMATION</h5>
            <ul>
              <li><a href="#">À propos</a></li>
              <li><a href="#">Conditions Générales de Vente</a></li>
              <li><a href="#">Politique de Confidentialité</a></li>
              <li><a href="#">Achats sécurisés</a></li>
              <li><a href="#">Statut de la commande</a></li>
              <li><a href="#">Mode de paiement</a></li>
            </ul>
          </div>
          <div className="col-md-3">
            <h5>NOS SERVICES</h5>
            <ul>
              <li><a href="#">Service Entreprise</a></li>
              <li><a href="#">Service Clients</a></li>
              <li><a href="#">Service Livraison</a></li>
              <li><a href="#">Service après-vente</a></li>
              <li><a href="#">Nous contacter</a></li>
              <li><a href="#">Suivez vos commandes</a></li>
            </ul>
          </div>
          <div className="col-md-3">
            <h5>INFORMATIONS DE CONTACT</h5>
            <ul className="contact-info">
              <li><i className="fas fa-phone"></i> (+216) 36 360 000</li>
              <li><i className="fas fa-envelope"></i> info@InfoZone.tn - devis@InfoZone.tn</li>
            </ul>
          </div>
          <div className="col-md-3 newsletter-section">
            <h5>S'INSCRIRE AUX NEWSLETTERS</h5>
            <div className="newsletter">
              <p>Inscrivez-vous à la newsletter InfoZone</p>
              <div className="input-group">
                <input placeholder="Saisissez votre email" type="email" className="form-control" />
                <button className="btn btn-success">SOUSCRIRE</button>
              </div>
            </div>
            <div className="payment-icons">
              <img alt="paypal" className="paypal-icon" height="60" src={ppImage} width="60" /> {/* Use the imported image */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
