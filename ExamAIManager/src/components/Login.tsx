
import  { useState } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import axios from 'axios';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success'); // success or error

  const handleLogin = async () => {
    // בדיקת קלט
    if (!email || !password) {
      setMessageType('error');
      setMessage('אנא מלא את כל השדות');
      return;
    }

    try {
      const response = await axios.post('https://localhost:7083/api/Auth/login', {
        email,
        password,
      });

      if (response.status === 200) {
        setMessageType('success');
        setMessage('התחברת בהצלחה!');
      } else {
        setMessageType('error');
        setMessage('ההתחברות נכשלה');
      }
    } catch (error) {
      setMessageType('error');
      setMessage('הייתה שגיאה בתקשורת');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', padding: 3, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom align="center">
        התחבר לחשבון שלך
      </Typography>
      
      <TextField
        label="מייל"
        type="email"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="סיסמה"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleLogin}
        sx={{ marginTop: 2 }}
      >
        התחבר
      </Button>

      {message && (
        <Alert
          severity={messageType === 'success' ? 'success' : 'error'}
          sx={{ marginTop: 2 }}
        >
          {message}
        </Alert>
      )}
    </Box>
  );
};

export default LoginForm;


