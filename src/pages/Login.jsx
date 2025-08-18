import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const isValidPassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*\d).{6,}$/;
    return regex.test(password);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setEmailError("");
    setPasswordError("");

    if (!email) {
      setEmailError("Email is required");
      setLoading(false);
      return;
    }

    if (!isValidEmail(email)) {
      setEmailError("Invalid email format");
      setLoading(false);
      return;
    }

    if (!password) {
      setPasswordError("Password is required");
      setLoading(false);
      return;
    }

    if (!isValidPassword(password)) {
      setPasswordError(
        "Password must include uppercase, number, and special character"
      );
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/user/login", {
        email,
        password,
      });

      const token = res.data?.token;
      Cookies.set("token", token, { sameSite: "Lax" });

      // Decode role
      let role = "user";
      try {
        const decoded = jwtDecode(token);
        if (decoded?.role) role = decoded.role;
      } catch (err) {}

      window.dispatchEvent(new Event("auth-changed"));
      toast.success("Login successful");
      navigate(role === "admin" ? "/admin-dashboard" : "/", { replace: true });
    } catch (err) {
      const message = err?.response?.data?.message || "Login failed";

      // Show error message
      if (message.toLowerCase().includes("password")) {
        setPasswordError("Password is incorrect");
      } else {
        setEmailError(message);
      }
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
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
        {emailError && <p style={errorText}>{emailError}</p>}

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />
        {passwordError && <p style={errorText}>{passwordError}</p>}

        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p style={{ marginTop: 15 }}>
          Don’t have an account?{" "}
          <Link to="/register" style={{ color: "#007bff" }}>
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

// Styling
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
  gap: "10px",
};

const headingStyle = {
  textAlign: "center",
};

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

const errorText = {
  color: "red",
  fontSize: "13px",
  marginTop: "-8px",
  marginBottom: "5px",
};

export default Login;