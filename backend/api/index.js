const app = require("../server");

module.exports = (req, res) => {
  const originalUrl = req.url;

  if (originalUrl === "/") {
    req.url = "/";
  } else if (!originalUrl.startsWith("/api")) {
    req.url = `/api${originalUrl}`;
  }

  return app(req, res);
};