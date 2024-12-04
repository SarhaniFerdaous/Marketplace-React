import React, { useState, useEffect } from "react";
import { Spinner, Container } from "react-bootstrap"; // Import spinner from react-bootstrap

const LoadingPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // Set isLoading to false after 1 second if page isn't loaded
    }, 1000);

    // Clear the timeout if the component is unmounted before the timeout
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
          {/* Your page content goes here */}
          <h3>Page has finished loading!</h3>
        </div>
      )}
    </Container>
  );
};

export default LoadingPage;
