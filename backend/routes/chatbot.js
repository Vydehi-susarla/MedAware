const express = require('express');
const router = express.Router();
const { getChatbotResponse } = require('../chatbot/chatbot');

// @route   POST /api/chatbot
// @desc    Get advice from disposal chatbot
// @access  Public
router.post('/', (req, res) => {
  const { message } = req.body;
  const reply = getChatbotResponse(message);
  res.json({ reply });
});

module.exports = router;
