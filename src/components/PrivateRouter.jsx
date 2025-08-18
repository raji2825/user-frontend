import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const PrivateRoute = ({ children, adminOnly = false }) => {
  const token = Cookies.get("token");
  if (!token) return <Navigate to="/login" replace />;

  try {
    const { role, exp } = jwtDecode(token);

    if (exp && Date.now() >= exp * 1000) {
      Cookies.remove("token");
      return <Navigate to="/login" replace />;
    }

    if (adminOnly && role !== "admin") return <Navigate to="/" replace />;

    return children;
  } catch {
    Cookies.remove("token");
    return <Navigate to="/login" replace />;
  }
};

export default PrivateRoute;