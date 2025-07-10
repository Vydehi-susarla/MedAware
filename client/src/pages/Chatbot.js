import React, { useState } from "react";

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const responses = {
    paracetamol: "Expired paracetamol can be used up to 1 year after expiry for mild fever or pain relief, but consult a doctor if unsure.",
    ibuprofen: "Expired ibuprofen may lose potency. Avoid using it beyond 6 months past expiry.",
    amoxicillin: "Avoid using expired antibiotics like Amoxicillin. They can become harmful or ineffective.",
    donate: "You can donate expired or unused medicines through the 'Donate' tab. Only medicines within 1 year of expiry and sealed packs are allowed.",
    default: "Sorry, I don't have information about that. Try asking about Paracetamol, Ibuprofen, or Donation info."
  };

  const handleSend = () => {
    const text = input.toLowerCase();
    let response = responses.default;

    if (text.includes("paracetamol")) response = responses.paracetamol;
    else if (text.includes("ibuprofen")) response = responses.ibuprofen;
    else if (text.includes("amoxicillin")) response = responses.amoxicillin;
    else if (text.includes("donate") || text.includes("donation")) response = responses.donate;

    setMessages((prev) => [...prev, { user: input, bot: response }]);
    setInput("");
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>💊 Medicine Chatbot</h2>
      <div style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "10px", minHeight: "200px" }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <strong>You:</strong> {msg.user}
            <br />
            <strong>Bot:</strong> {msg.bot}
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask about a medicine or donation"
        style={{ width: "70%", padding: "8px", marginTop: "10px" }}
      />
      <button onClick={handleSend} style={{ padding: "8px 15px", marginLeft: "10px" }}>
        Send
      </button>
    </div>
  );
}
