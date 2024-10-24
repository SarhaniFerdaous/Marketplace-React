import React from 'react';
import Header from './composants/header'; // Ensure this matches your actual file case
import Footer from './composants/footer'; // Ensure this matches your actual file case

const Layout = ({ children }) => {
  return (
    <div className="layout-container">
      <Header />
      <main className="content">{children}</main>
      <Footer />
      
      <style>{`
        /* Make sure the layout container takes full height */
        .layout-container {
          display: flex;
          flex-direction: column;
          min-height: 100vh; /* Minimum height of the viewport */
        }

        /* Main content area */
        .content {
          flex: 1; /* This allows the main content area to grow and take available space */
        }

        /* Footer styling */
        .footer {
          background-color: #f8f9fa; /* Example footer color */
          padding: 20px; /* Padding for the footer */
          text-align: center; /* Center align footer content */
        }
      `}</style>
    </div>
  );
};

export default Layout;
