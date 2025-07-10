import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Donate() {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [meds, setMeds] = useState([]);

  const submit = async () => {
    await axios.post("http://localhost:5000/api/medicine/add", {
      name,
      description: desc,
      postedBy: "testuser",
    });
    alert("Medicine Posted");
    fetchMeds();
  };

  const fetchMeds = async () => {
    const res = await axios.get("http://localhost:5000/api/medicine/all");
    setMeds(res.data);
  };

  const claim = async (id) => {
    await axios.post(`http://localhost:5000/api/medicine/claim/${id}`);
    fetchMeds();
  };

  useEffect(() => {
    fetchMeds();
  }, []);

  return (
    <div>
      <h2>Post a Tablet</h2>
      <input placeholder="Tablet Name" onChange={(e) => setName(e.target.value)} />
      <input placeholder="Description" onChange={(e) => setDesc(e.target.value)} />
      <button onClick={submit}>Post</button>

      <h2>Available Tablets</h2>
      <ul>
        {meds.map((med) => (
          <li key={med._id}>
            {med.name} - {med.description} - Posted by {med.postedBy}
            <button onClick={() => claim(med._id)}>Claim</button>
          </li>
        ))}
      </ul>
    </div>
  );
}