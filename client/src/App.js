import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Donate from "./pages/Donate";
import Chatbot from "./pages/Chatbot";
import Feed from "./pages/Feed";
import Confirm from "./pages/Confirm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/confirm" element={<Confirm />} />
        {/* Default route */}
        <Route path="*" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
