// src/pages/Signup.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Signup.css";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // ✅ This line sends the data to your backend to store in MongoDB
      await axios.post("http://localhost:8080/signup", {
        name,
        email,
        password,
      });

      alert("✅ Signup successful!");
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err);
      if (err.response && err.response.status === 400) {
        alert("❌ User already exists with this email.");
      } else {
        alert("❌ Signup failed. Please try again.");
      }
    }
  };

  return (
    <div className="signup-wrapper">
      <header className="signup-header">
        <button className="back-btn" onClick={() => navigate("/")}>
          Back
        </button>
        <span className="signup-title">MEDAWARE</span>
      </header>

      <form onSubmit={handleSignup} className="signup-form">
        <h2>Sign Up</h2>

        <label htmlFor="name">Name:</label>
        <input
          id="name"
          type="text"
          placeholder="Enter your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Sign Up</button>

        <p className="login-link">
          Already have an account?{" "}
          <span className="highlight" onClick={() => navigate("/login")}>
            Login here
          </span>
        </p>
      </form>
    </div>
  );
}
