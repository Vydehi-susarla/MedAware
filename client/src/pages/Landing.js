import React from "react";
import "./Landing.css"; // We'll move styles here later

export default function Landing() {
  return (
    <div
      style={{ padding: "20px", backgroundColor: "#f0f9ff", color: "#1a202c" }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 0",
        }}
      >
        <div></div>
        <button
          className="login-btn"
          onClick={() => (window.location.href = "/login")}
        >
          Login / Signup
        </button>
      </header>

      <div className="title" style={{ textAlign: "center", marginTop: "10px" }}>
        <h1 style={{ fontSize: "3rem", color: "#023047" }}>MEDAWARE</h1>
        <h3 style={{ textAlign:"center", color: "#2bb593", fontWeight: "500", marginTop: "5px" }}>
          Waste to Worth
        </h3>
      </div>

      <div
        className="description"
        style={{
          textAlign: "center",
          maxWidth: "700px",
          margin: "20px auto",
          color: "#555",
        }}
      >
        <p>
          MedAware is an initiative to make use of medicines in a responsible
          way. Our mission is to educate users about medicine usage through a
          chatbot and encourage donations of medicines to support those in need.
        </p>
      </div>

      <div
        className="features"
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginTop: "40px",
          flexWrap: "wrap",
        }}
      >
        <div
          className="card"
          style={{
            backgroundColor: "#fff",
            width: "320px",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            textAlign: "center",
            margin: "10px",
            transition: "transform 0.3s ease",
          }}
        >
          <img
            src="https://tse3.mm.bing.net/th/id/OIP.b7dNH6OV_2sJnOApEufpHwHaEK?pid=Api&P=0&h=180"
            alt="Chatbot"
            style={{
              width: "100%",
              height: "180px",
              borderRadius: "8px",
              objectFit: "cover",
            }}
          />
          <h2 style={{ color: "#2bb593", margin: "15px 0 10px" }}>
            Medicine Chatbot
          </h2>
          <p style={{ fontSize: "14px", color: "#555" }}>
            Enter the name of any medicine to know its uses, dosage, and
            precautions through our AI-powered chatbot.
          </p>
        </div>

        <div
          className="card"
          style={{
            backgroundColor: "#fff",
            width: "320px",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            textAlign: "center",
            margin: "10px",
            transition: "transform 0.3s ease",
          }}
        >
          <img
            src="https://png.pngtree.com/png-clipart/20230313/original/pngtree-caring-people-donate-medications-to-in-need-png-image_8987383.png"
            alt="Donate Medicines"
            style={{
              width: "100%",
              height: "180px",
              borderRadius: "8px",
              objectFit: "cover",
            }}
          />
          <h2 style={{ color: "#2bb593", margin: "15px 0 10px" }}>
            Donate Medicines
          </h2>
          <p style={{ fontSize: "14px", color: "#555" }}>
            Donate or claim medicines safely so that they can be utilized by
            organizations working for underprivileged health care.
          </p>
        </div>
      </div>
    </div>
  );
}
