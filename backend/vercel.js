require("dotenv").config();

const express = require("express");
const cors = require("cors");

const signRoutesModule = require("./routes/signRoutes");
const authRoutesModule = require("./routes/authRoutes");
const translationRoutesModule = require("./routes/translationRoutes");
const conversationRoutesModule = require("./routes/conversationRoutes");

require("./database/db");

const getRouter = (moduleValue, name) => {
  if (typeof moduleValue === "function") {
    return moduleValue;
  }

  if (moduleValue && typeof moduleValue.router === "function") {
    return moduleValue.router;
  }

  if (moduleValue && typeof moduleValue.default === "function") {
    return moduleValue.default;
  }

  if (moduleValue && typeof moduleValue.default === "object") {
    return getRouter(moduleValue.default, `${name}.default`);
  }

  if (moduleValue && typeof moduleValue === "object") {
    for (const [key, value] of Object.entries(moduleValue)) {
      if (typeof value === "function") {
        return value;
      }

      if (value && typeof value === "object") {
        try {
          return getRouter(value, `${name}.${key}`);
        } catch {
          // Continue checking other exports.
        }
      }
    }
  }

  throw new TypeError(
    `Unable to find Express router for ${name}. Received ${typeof moduleValue}`
  );
};

const signRoutes = getRouter(signRoutesModule, "signRoutes");
const authRoutes = getRouter(authRoutesModule, "authRoutes");
const translationRoutes = getRouter(
  translationRoutesModule,
  "translationRoutes"
);
const conversationRoutes = getRouter(
  conversationRoutesModule,
  "conversationRoutes"
);

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
  })
);

app.use(express.json());

app.use("/api", signRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/translation", translationRoutes);
app.use("/api/conversation", conversationRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SignBridge Backend is running!",
  });
});

module.exports = app;