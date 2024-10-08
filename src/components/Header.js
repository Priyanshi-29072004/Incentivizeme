import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Incentivizeme
        </Typography>
        <Button color="inherit" component={Link} to="/">
          Dashboard
        </Button>
        <Button color="inherit" component={Link} to="/employees">
          Employee
        </Button>
        <Button color="inherit" component={Link} to="/project">
          Project
        </Button>
        <Button color="inherit" component={Link} to="/attendance">
          Attendance
        </Button>
        <Button color="inherit" component={Link} to="/report">
          Report
        </Button>
        {!isAuthenticated ? (
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
        ) : (
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
