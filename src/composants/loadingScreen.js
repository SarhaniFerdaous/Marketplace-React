import React, { useState, useEffect } from "react";
import { Spinner, Container } from "react-bootstrap"; 

const LoadingPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); 
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Container>
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
          <Spinner animation="border" role="status" />
          <span className="sr-only">Loading...</span>
        </div>
      ) : (
        <div>
        
          <h3>Page has finished loading!</h3>
        </div>
      )}
    </Container>
  );
};

export default LoadingPage;
