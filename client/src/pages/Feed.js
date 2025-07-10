import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Feed() {
  const [medicines, setMedicines] = useState([]);
  const [takenId, setTakenId] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/medicine")
      .then(res => {
        const available = res.data.filter(m => !m.claimed && !m.isCollected);
        setMedicines(available);
      });
  }, []);

  const handleTake = async (id) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/medicine/take/${id}`);
      setTakenId(res.data.receiverId);
      alert(`Success! Your Receiver ID is: ${res.data.receiverId}`);
    } catch (err) {
      alert("Error taking medicine.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Available Medicines</h2>
      {medicines.map(med => (
        <div key={med._id} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
          <h4>{med.name}</h4>
          <p>{med.description}</p>
          <button onClick={() => handleTake(med._id)}>Take</button>
        </div>
      ))}
      {takenId && <p><strong>Your Receiver ID:</strong> {takenId}</p>}
    </div>
  );
}
