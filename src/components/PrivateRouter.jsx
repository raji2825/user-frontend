import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const PrivateRoute = ({ children }) => {
  const token = Cookies.get("token");
  if (!token) return <Navigate to="/login" replace />;

  try {
    const { exp } = jwtDecode(token);

    // Check if token is expired
    if (exp && Date.now() >= exp * 1000) {
      Cookies.remove("token");
      return <Navigate to="/login" replace />;
    }

    return children; // ✅ Allow user
  } catch {
    Cookies.remove("token");
    return <Navigate to="/login" replace />;
  }
};

export default PrivateRoute;