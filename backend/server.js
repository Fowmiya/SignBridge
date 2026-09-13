require("dotenv").config();

const express = require("express");
const cors = require("cors");

const signRoutesModule = require("./routes/signRoutes");
const authRoutesModule = require("./routes/authRoutes");
const translationRoutesModule = require("./routes/translationRoutes");
const conversationRoutesModule = require("./routes/conversationRoutes");

require("./database/db");

const getRouter = (moduleValue) => {
  if (typeof moduleValue === "function") {
    return moduleValue;
  }

  if (moduleValue && typeof moduleValue.default === "function") {
    return moduleValue.default;
  }

  throw new TypeError("Route module did not export an Express router");
};

const signRoutes = getRouter(signRoutesModule);
const authRoutes = getRouter(authRoutesModule);
const translationRoutes = getRouter(translationRoutesModule);
const conversationRoutes = getRouter(conversationRoutesModule);

const app = express();

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

module.exports = app;

// Start the server only when running locally
if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(
      `SignBridge Backend running on http://localhost:${PORT}`
    );
  });
}