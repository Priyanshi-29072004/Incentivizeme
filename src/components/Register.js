import React, { useState } from "react";
import axios from "../api/axiosConfig.js";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (input) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(input);
  };

  const handleChange = (e) => {
    setUsername(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateEmail(username)) {
      setError("Invalid email format. Please enter a valid email address.");
      return;
    }

    if (password !== password2) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    try {
      const response = await axios.post("register/", {
        email: username,
        password,
      });
      if (response.status === 201) {
        setSuccess(true);
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError(error);
      }
    }
  };

  const handleClose = () => {
    setSuccess(false);
    navigate("/login");
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 8,
        }}
      >
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password2"
            label="Confirm Password"
            type="password"
            id="password2"
            autoComplete="new-password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
        </Box>
        <Typography variant="body2">
          Already have an account? <Link to="/login">Login</Link>
        </Typography>

        <Snackbar
          open={success}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          autoHideDuration={6000}
        >
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
            action={
              <Button color="inherit" size="small" onClick={handleClose}>
                OK
              </Button>
            }
          >
            Registration successful! Please log in.
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default Register;
