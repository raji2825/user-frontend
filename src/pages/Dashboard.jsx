import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [msg, setMsg] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      if (!token || !user) {
        navigate("/");
        return;
      }

      if (user.role === "admin") {
        try {
          const res = await axios.get("http://localhost:5000/api/auth/admin-dashboard", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setMsg(res.data.message);
        } catch {
          setMsg("Access denied or session expired");
        }
      } else {
        setMsg(`Welcome, ${user.name} (User)`);
      }
    };

    fetchData();
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>{msg}</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
