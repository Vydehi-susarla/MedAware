require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Support larger Base64 image payload
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Basic Route
app.get('/api/health', (req, res) => {
  res.json({ message: 'MedAware API is running successfully' });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/medicines', require('./routes/medicines'));
app.use('/api/chatbot', require('./routes/chatbot'));

// 404 Route handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'API Route Not Found' });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
