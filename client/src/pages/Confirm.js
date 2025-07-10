import React, { useState } from "react";
import axios from "axios";

export default function Confirm() {
  const [medicineId, setMedicineId] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [message, setMessage] = useState("");

  const handleConfirm = async () => {
    try {
      const res = await axios.post(`http://localhost:5000/api/medicine/confirm/${medicineId}`, { receiverId });
      setMessage("✅ Medicine handover confirmed!");
    } catch (err) {
      setMessage("❌ Failed. Invalid Receiver ID or Medicine ID.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Confirm Medicine Handover</h2>
      <input
        placeholder="Medicine ID"
        value={medicineId}
        onChange={(e) => setMedicineId(e.target.value)}
        style={{ width: "200px", margin: "10px" }}
      />
      <input
        placeholder="Receiver ID"
        value={receiverId}
        onChange={(e) => setReceiverId(e.target.value)}
        style={{ width: "200px", margin: "10px" }}
      />
      <br />
      <button onClick={handleConfirm}>Confirm Handover</button>
      <p>{message}</p>
    </div>
  );
}
