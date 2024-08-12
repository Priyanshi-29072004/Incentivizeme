import logo from "./logo.svg";
import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "components/Header";
import { HomePage } from "components/HomePage";
import { Employee } from "components/Employee";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/employees" element={<Employee />} />
      </Routes>
    </Router>
  );
}

export default App;
