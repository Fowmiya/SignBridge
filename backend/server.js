require("dotenv").config();

const express = require("express");
const cors = require("cors");

const signRoutesModule = require("./routes/signRoutes");
const authRoutesModule = require("./routes/authRoutes");
const translationRoutesModule = require("./routes/translationRoutes");
const conversationRoutesModule = require("./routes/conversationRoutes");

require("./database/db");

console.log("Vercel route module types:", {
  sign: typeof signRoutesModule,
  auth: typeof authRoutesModule,
  translation: typeof translationRoutesModule,
  conversation: typeof conversationRoutesModule,
});

console.log("Vercel route module keys:", {
  sign: signRoutesModule && Object.keys(signRoutesModule),
  auth: authRoutesModule && Object.keys(authRoutesModule),
  translation: translationRoutesModule && Object.keys(translationRoutesModule),
  conversation: conversationRoutesModule && Object.keys(conversationRoutesModule),
});

const getRouter = (moduleValue, name) => {
  if (typeof moduleValue === "function") {
    return moduleValue;
  }

  if (moduleValue && typeof moduleValue.default === "function") {
    return moduleValue.default;
  }

  if (moduleValue && typeof moduleValue.router === "function") {
    return moduleValue.router;
  }

  throw new TypeError(
    `Route module "${name}" did not export an Express router. Type: ${typeof moduleValue}`
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

if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(
      `SignBridge Backend running on http://localhost:${PORT}`
    );
  });
}