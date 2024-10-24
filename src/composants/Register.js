import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth'; 
import { getAuth } from 'firebase/auth'; 

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();


  // Initialize Firebase (assuming you have Firebase initialized in your app)
  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true); // Start loading

      // Create user with Firebase Authentication
      const auth = getAuth(); // Assuming Firebase is initialized globally
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Handle successful registration
      setSuccess(true);
      setError(null);
      setTimeout(() => {
        navigate('/login'); // Redirect to login page
      }, 2000);
    } catch (err) {
      setError('Registration failed. Please try again.');
      setSuccess(false);
      console.error(err); // Log the error for debugging
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <Container>
      <h2>Register</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">Registration successful! Redirecting to login...</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'} {/* Loading state for button */}
        </Button>
      </Form>
    </Container>
  );
};

export default Register;