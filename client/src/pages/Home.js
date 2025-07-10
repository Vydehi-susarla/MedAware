import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  // ✅ Redirect to login if not logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn !== "true") {
      alert("⚠️ Please login first.");
      navigate("/login");
    }
  }, [navigate]);

  // ✅ Handle logout properly
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn"); // remove session
    alert("Logged out successfully!");
    navigate("/");
  };

  return (
    <div>
      <nav className="navbar">
        <div className="nav-title">MEDAWARE</div>
        <div className="nav-buttons">
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="features">
        <div className="card">
          <h2>Medicine Chatbot</h2>
          <p>
            Confused about a medicine? Just enter its name into our AI-powered
            chatbot to get information like its usage, dosage, precautions, side
            effects, and whether it requires a prescription.
          </p>
          <button onClick={() => navigate("/chatbot")}>Chatbot</button>
        </div>

        <div className="card">
          <h2>Donate / Claim Medicines</h2>
          <p>
            Have unused or expired medicines? You can donate them for reuse or
            disposal. Or if you need medicines, browse donated items. We reduce
            waste and help those in need.
          </p>
          <button onClick={() => navigate("/donate")}>Donate / Claim</button>
        </div>
      </div>
    </div>
  );
}
