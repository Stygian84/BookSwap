import { Container, Typography, TextField, Button, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function LoginContent() {
  return (
    <Container maxWidth="sm" style={{ marginTop: '100px' }}>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <form>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
        />
        <Button
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
    </Container>
  );
}

export { LoginContent };
