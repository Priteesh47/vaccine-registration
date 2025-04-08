require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const db = require("./config/db");
const authRouter = require("./routes/authRoutes");
const adminRouter = require("./routes/dashboardRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const vaccineRoutes = require("./routes/vaccineRoutes");
const centerRoutes = require("./routes/centerRoutes");
const userProfileRoutes = require("./routes/userProfileRoutes");
const userRoutes = require("./routes/userRoutes");
const multer = require("multer");

const app = express();

// Test and log database connection
db.getConnection()
  .then((connection) => {
    console.log("Database connected successfully");
    connection.release();
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1);
  });

// Ensure necessary uploads directories exist
const uploadsDir = path.join(__dirname, "uploads");
const profilePicsDir = path.join(uploadsDir, "profile-pictures");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(profilePicsDir)) {
  fs.mkdirSync(profilePicsDir, { recursive: true });
}

// CORS configuration for client origins (e.g. localhost:5173)
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Serve static files (e.g., uploaded images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Request logging for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/dashboard", adminRouter);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/vaccines", vaccineRoutes);
app.use("/api/centers", centerRoutes);
app.use("/api/profile", userProfileRoutes);
app.use("/api/user", userRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: "File upload error: " + err.message,
    });
  }
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// Fallback for undefined routes (404)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global exception handlers
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

// Use environment variable PORT if set, or fallback to 9000
const PORT = process.env.PORT || 9000;

app
  .listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
    console.log("CORS enabled for: http://localhost:5173");
  })
  .on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(
        `Port ${PORT} is already in use. Please try a different port.`
      );
      process.exit(1);
    } else {
      console.error("Server error:", err);
    }
  });
