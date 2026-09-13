require("dotenv").config();

const express = require("express");
const cors = require("cors");

const signRoutesModule = require("./routes/signRoutes");
const authRoutesModule = require("./routes/authRoutes");
const translationRoutesModule = require("./routes/translationRoutes");
const conversationRoutesModule = require("./routes/conversationRoutes");

require("./database/db");

const app = express();

console.log("Vercel route module types:", {
  sign: typeof signRoutesModule,
  auth: typeof authRoutesModule,
  translation: typeof translationRoutesModule,
  conversation: typeof conversationRoutesModule,
});

console.log("Vercel route module keys:", {
  sign:
    signRoutesModule && typeof signRoutesModule === "object"
      ? Object.keys(signRoutesModule)
      : [],
  auth:
    authRoutesModule && typeof authRoutesModule === "object"
      ? Object.keys(authRoutesModule)
      : [],
  translation:
    translationRoutesModule &&
    typeof translationRoutesModule === "object"
      ? Object.keys(translationRoutesModule)
      : [],
  conversation:
    conversationRoutesModule &&
    typeof conversationRoutesModule === "object"
      ? Object.keys(conversationRoutesModule)
      : [],
});

const getRouter = (moduleValue, moduleName) => {
  // Normal CommonJS export
  if (typeof moduleValue === "function") {
    return moduleValue;
  }

  // ES module default export
  if (
    moduleValue &&
    typeof moduleValue.default === "function"
  ) {
    return moduleValue.default;
  }

  // Vercel/bundler router export
  if (
    moduleValue &&
    typeof moduleValue.router === "function"
  ) {
    return moduleValue.router;
  }

  // Vercel may wrap a CommonJS export under the filename/module name.
  if (moduleValue && typeof moduleValue === "object") {
    const functionExport = Object.values(moduleValue).find(
      (value) => typeof value === "function"
    );

    if (functionExport) {
      return functionExport;
    }
  }

  throw new TypeError(
    `Route module "${moduleName}" did not export an Express router. Type: ${typeof moduleValue}`
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