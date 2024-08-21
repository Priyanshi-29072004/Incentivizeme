import { useNavigate } from "react-router-dom";
import axios from "../api/axiosConfig.js";
import { useEffect } from "react";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = () => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      delete axios.defaults.headers.common["Authorization"];
      navigate("/login");
    };

    handleLogout();
  }, [navigate]);

  return null;
};

export default Logout;
