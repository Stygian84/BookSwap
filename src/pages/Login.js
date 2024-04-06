import { Container, Typography, TextField, Button, Link } from '@mui/material';
import { Link as RouterLink, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';

function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsLoggedIn(true);
    } catch (error) {
      setError(error.message);
    }
  };

  if (isLoggedIn) {
    return <Navigate to="/home" />;
  }

  return (
    <Container maxWidth="sm" style={{ marginTop: '100px' }}>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleLogin}>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          style={{ marginTop: '20px' }}
        >
          Login
        </Button>
      </form>
      <Typography variant="body1" style={{ marginTop: '20px' }}>
        Not a registered user?{' '}
        <Link component={RouterLink} to="/register">
          Register here
        </Link>
      </Typography>
      {error && (
        <Typography variant="body1" color="error" style={{ marginTop: '20px' }}>
          {error}
        </Typography>
      )}
    </Container>
  );
}


export default LoginContent;
