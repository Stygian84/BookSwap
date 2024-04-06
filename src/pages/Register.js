import { useState } from 'react';
import { Container, Typography, TextField, Button } from '@mui/material';
import { auth, firestore } from '../firebase'; 
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Navigate } from 'react-router-dom';
import { collection, doc, setDoc } from "firebase/firestore";

function RegisterContent() { 
    
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth,email, password);

      await setDoc(doc(collection(firestore, "users"), user.uid), {
        username,
        name,
        email,
        phoneNumber
      });

      setRedirectToLogin(true);
    } catch (error) {
      console.error('Error registering user:', error.message);
    }
  };
  if (redirectToLogin) {
    return <Navigate to="/" />;
  }
  return (
    <Container maxWidth="sm" style={{ marginTop: '100px' }}>
      <Typography variant="h4" gutterBottom>
        Register
      </Typography>
      <form>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Phone Number"
          type="tel"
          variant="outlined"
          fullWidth
          margin="normal"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
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
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          style={{ marginTop: '20px' }}
          onClick={handleRegister}
        >
          Register
        </Button>
      </form>
    </Container>
  );
}

export default RegisterContent;
