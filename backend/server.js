require("dotenv").config();

const express = require("express");
const cors = require("cors");

const signRoutes = require("./routes/signRoutes");
const authRoutes = require("./routes/authRoutes");
const translationRoutes = require("./routes/translationRoutes");
const conversationRoutes = require("./routes/conversationRoutes");

const db = require("./database/db");

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
  })
);

app.use(express.json());

// API routes
app.use("/api", signRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/translation", translationRoutes);
app.use("/api/conversation", conversationRoutes);

// Basic server check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SignBridge Backend is running!",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(
    `SignBridge Backend running on http://localhost:${PORT}`
  );
});