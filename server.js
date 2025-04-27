const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const authRoutes = require('./routes/authRoutes');
const groupRoutes = require('./routes/groupRoutes');
const taskRoutes = require('./routes/taskRoutes');

// Initialize app
const app = express();

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175', // Add your current Vite port
  'http://localhost:3000', // For Electron dev (optional)
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like Electron file://) or from allowed origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // Allow cookies, auth headers
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/tasks', taskRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    body: req.body,
  });
  res.status(500).json({ message: 'Server Error', error: err.message });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use('/', (req, res) => {
  res.send('<h1>Welcome to TodoList Page</h1>');
});
