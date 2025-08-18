// src/pages/Login.jsx
import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call your backend login
      const res = await axios.post("http://localhost:5000/api/user/login", {
        email,
        password,
      });

      const token = res.data?.token;
      if (!token) {
        alert("No token returned from server.");
        setLoading(false);
        return;
      }

      // Save token in cookie
      Cookies.set("token", token, { sameSite: "Lax" /*, expires: 1 */ });

      // Determine role from JWT (fallback to response body if present)
      let role = "user";
      try {
        const decoded = jwtDecode(token);
        if (decoded?.role) role = decoded.role;
      } catch {
        if (res.data?.user?.role) role = res.data.user.role;
      }

      // Optional: notify other components (Header) that auth changed
      window.dispatchEvent(new Event("auth-changed"));

      // Redirect by role
      navigate(role === "admin" ? "/admin-dashboard" : "/", { replace: true });
    } catch (err) {
      console.error("LOGIN ERROR:", err?.response?.data || err.message);
      alert(err?.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleLogin} style={formStyle}>
        <h2 style={headingStyle}>Login</h2>

        <input
          type="email"
          name="email"
          autoComplete="email"
          placeholder="Enter your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

       
      </form>
    </div>
  );
};

// 🎨 (same basic styles you were using)
const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  backgroundColor: "#f0f2f5",
};

const formStyle = {
  backgroundColor: "white",
  padding: "30px",
  borderRadius: "10px",
  boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  width: "100%",
  maxWidth: "400px",
  display: "flex",
  flexDirection: "column",
  gap: "15px",
};

const headingStyle = { marginBottom: "10px", textAlign: "center", color: "#333" };

const inputStyle = {
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  fontSize: "16px",
};

const buttonStyle = {
  padding: "10px",
  backgroundColor: "#007bff",
  color: "white",
  fontSize: "16px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

export default Login;