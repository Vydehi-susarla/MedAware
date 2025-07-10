import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // ✅ Redirect to home if already logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn === "true") {
      navigate("/home");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8080/login", {
        email,
        password,
      });

      localStorage.setItem("isLoggedIn", "true");
      alert("✅ Login successful!");
      navigate("/home");
    } catch (err) {
      if (err.response && err.response.status === 400) {
        alert("❌ Invalid email or password.");
      } else {
        alert("❌ Login failed. Server error.");
      }
    }
  };

  return (
    <div className="login-wrapper">
      <header className="login-header">
        <button className="back-btn" onClick={() => navigate("/")}>
          Back
        </button>
        <span className="login-title">MEDAWARE</span>
      </header>

      <div className="login-container">
        <h1>Admin Login</h1>

        <form onSubmit={handleLogin}>
          <h2>Email</h2>
          <input
            type="email"
            placeholder="👤 Type your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <h3>Password</h3>
          <input
            type="password"
            placeholder="🔒 Type your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>
        </form>

        <h4>
          Not registered?
          <span className="signup-link" onClick={() => navigate("/signup")}>
            Click here to Signup
          </span>
        </h4>
      </div>
    </div>
  );
}
