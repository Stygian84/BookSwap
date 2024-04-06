import { useState } from "react";
import { Container, Typography, TextField, Button, Select, MenuItem } from "@mui/material";
import { auth, firestore } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Navigate } from "react-router-dom";
import { collection, doc, setDoc } from "firebase/firestore";

function RegisterContent() {
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [missingFields, setMissingFields] = useState([]);

  const handleRegister = async () => {
    const missing = [];
    if (!username.trim()) missing.push("Username");
    if (!name.trim()) missing.push("Name");
    if (!email.trim()) missing.push("Email");
    if (!phoneNumber.trim()) missing.push("Phone Number");
    if (!password.trim()) missing.push("Password");
    if (!location.trim()) missing.push("Location");

    if (missing.length > 0) {
      setMissingFields(missing);
      return;
    }
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(collection(firestore, "users"), user.uid), {
        username,
        name,
        email,
        phoneNumber,
        location: location.toLowerCase(),
      });

      setRedirectToLogin(true);
    } catch (error) {
      setError(error.message);
      console.error("Error registering user:", error.message);
    }
  };
  if (redirectToLogin) {
    return <Navigate to="/" />;
  }
  return (
    <Container maxWidth="sm" style={{ marginTop: "100px" }}>
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
        <Select
          label="Location"
          variant="outlined"
          fullWidth
          margin="normal"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          <MenuItem value="">Select Location</MenuItem>
          <MenuItem value="East">East</MenuItem>
          <MenuItem value="West">West</MenuItem>
          <MenuItem value="Central">Central</MenuItem>
          <MenuItem value="North">North</MenuItem>
        </Select>

        {/* Display error message */}
        {error && (
          <Typography variant="body2" color="error" style={{ marginTop: "10px" }}>
            {error}
          </Typography>
        )}

        {/* Display missing fields */}
        {missingFields.length > 0 && (
          <Typography variant="body2" color="error" style={{ marginTop: "10px" }}>
            Please fill in the following fields: {missingFields.join(", ")}
          </Typography>
        )}

        <Button
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          style={{ marginTop: "20px" }}
          onClick={handleRegister}
        >
          Register
        </Button>
      </form>
    </Container>
  );
}

export default RegisterContent;
