const Database = require("better-sqlite3");
const path = require("path");

const isVercel = Boolean(process.env.VERCEL);

const dbPath = isVercel
  ? path.join("/tmp", "signbridge.db")
  : path.join(__dirname, "signbridge.db");

const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

console.log(`SignBridge database connected: ${dbPath}`);

module.exports = db;