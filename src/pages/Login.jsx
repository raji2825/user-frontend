<<<<<<< HEAD
// src/pages/Login.jsx
=======
>>>>>>> 2f87889f4c9be8f649ce4b39dc7a4f8c3ca1a8a3
import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
<<<<<<< HEAD
=======
import { toast } from "react-toastify";
>>>>>>> 2f87889f4c9be8f649ce4b39dc7a4f8c3ca1a8a3

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
<<<<<<< HEAD
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
=======
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const isValidPassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*\d).{6,}$/;
    return regex.test(password);
  };
>>>>>>> 2f87889f4c9be8f649ce4b39dc7a4f8c3ca1a8a3

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
<<<<<<< HEAD

    try {
      // Call your backend login
=======
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
>>>>>>> 2f87889f4c9be8f649ce4b39dc7a4f8c3ca1a8a3
      const res = await axios.post("http://localhost:5000/api/user/login", {
        email,
        password,
      });

      const token = res.data?.token;
<<<<<<< HEAD
      if (!token) {
        alert("No token returned from server.");
        setLoading(false);
        return;
      }

      // Save token in cookie
      Cookies.set("token", token, { sameSite: "Lax" /*, expires: 1 */ });

      // Determine role from JWT (fallback to response body if present)
=======
      Cookies.set("token", token, { sameSite: "Lax" });

      // Decode role
>>>>>>> 2f87889f4c9be8f649ce4b39dc7a4f8c3ca1a8a3
      let role = "user";
      try {
        const decoded = jwtDecode(token);
        if (decoded?.role) role = decoded.role;
<<<<<<< HEAD
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
=======
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
>>>>>>> 2f87889f4c9be8f649ce4b39dc7a4f8c3ca1a8a3
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
<<<<<<< HEAD
          name="email"
          autoComplete="email"
          placeholder="Enter your email"
          required
=======
          placeholder="Enter email"
>>>>>>> 2f87889f4c9be8f649ce4b39dc7a4f8c3ca1a8a3
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
<<<<<<< HEAD

        <input
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          required
=======
        {emailError && <p style={errorText}>{emailError}</p>}

        <input
          type="password"
          placeholder="Enter password"
>>>>>>> 2f87889f4c9be8f649ce4b39dc7a4f8c3ca1a8a3
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />
<<<<<<< HEAD
=======
        {passwordError && <p style={errorText}>{passwordError}</p>}
>>>>>>> 2f87889f4c9be8f649ce4b39dc7a4f8c3ca1a8a3

        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

<<<<<<< HEAD
       
=======
        <p style={{ marginTop: 15 }}>
          Don’t have an account?{" "}
          <Link to="/register" style={{ color: "#007bff" }}>
            Register
          </Link>
        </p>
>>>>>>> 2f87889f4c9be8f649ce4b39dc7a4f8c3ca1a8a3
      </form>
    </div>
  );
};

<<<<<<< HEAD
// 🎨 (same basic styles you were using)
=======
// Styling
>>>>>>> 2f87889f4c9be8f649ce4b39dc7a4f8c3ca1a8a3
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
<<<<<<< HEAD
  gap: "15px",
};

const headingStyle = { marginBottom: "10px", textAlign: "center", color: "#333" };
=======
  gap: "10px",
};

const headingStyle = {
  textAlign: "center",
};
>>>>>>> 2f87889f4c9be8f649ce4b39dc7a4f8c3ca1a8a3

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

<<<<<<< HEAD
=======
const errorText = {
  color: "red",
  fontSize: "13px",
  marginTop: "-8px",
  marginBottom: "5px",
};

>>>>>>> 2f87889f4c9be8f649ce4b39dc7a4f8c3ca1a8a3
export default Login;