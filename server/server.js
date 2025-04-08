require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require('path');
const authRouter = require("./routes/authRoutes");
const adminRouter = require("./routes/dashboardRoutes");
const appointmentRoutes = require('./routes/appointmentRoutes');
const vaccineRoutes = require('./routes/vaccineRoutes');
const centerRoutes = require('./routes/centerRoutes');
const userProfileRoutes = require('./routes/userProfileRoutes');

const app = express();

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:5173', // Vite default port
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Parse JSON bodies
app.use(express.json());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/dashboard", adminRouter);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/vaccines', vaccineRoutes);
app.use('/api/centers', centerRoutes);
app.use('/api/profile', userProfileRoutes);

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.status || 500).json({ 
    success: false, 
    message: err.message || "Something went wrong!",
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`CORS enabled for: http://localhost:5173`);
}); 