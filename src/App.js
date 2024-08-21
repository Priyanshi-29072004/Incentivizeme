import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "components/Header";
import { HomePage } from "components/HomePage";
import { Employee } from "components/Employee";
import { Project } from "components/Project";
import { Attendance } from "components/Attendance";
import Login from "components/Login";
import Register from "components/Register";
import ForgotPassword from "components/ForgetPassword";
import Logout from "components/Logout";
import PrivateRoute from "components/PrivateRoute";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<PrivateRoute component={HomePage} />} />
        <Route
          path="/employees"
          element={<PrivateRoute component={Employee} />}
        />
        <Route path="/project" element={<PrivateRoute component={Project} />} />
        <Route
          path="/attendance"
          element={<PrivateRoute component={Attendance} />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
