import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase.config';
import { db } from '../firebase.config'; // Import Firestore
import { setDoc, doc } from 'firebase/firestore'; // Import Firestore methods
import { useUser } from '../context/UserContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store additional user information in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: name,
        email: email,
        // Add any additional fields you want
      });

      setSuccess(true);
      setError(null);
      setTimeout(() => navigate('/'), 2000); // Redirect to the home page
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignInRedirect = () => {
    navigate('/signin'); // Navigate to the Sign In page
  };

  return (
    <Container>
      <h2>Register</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">Registration successful! Redirecting to home...</Alert>}
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

        <div className="button-group">
          <Button variant="primary" type="submit" disabled={loading} className="me-2">
            {loading ? 'Registering...' : 'Register'}
          </Button>
          <Button variant="secondary" onClick={handleSignInRedirect}>
            Sign In
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default Register;
