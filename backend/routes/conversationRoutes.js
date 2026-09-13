const express = require("express");
const db = require("../database/db");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// Save a conversation message
router.post("/messages", authenticateToken, (req, res) => {
  try {
    const {
      sender,
      message,
      translatedText,
      sourceLang,
      targetLang,
      signLang,
      confidence,
    } = req.body;

    if (!sender || !message || !sourceLang || !targetLang) {
      return res.status(400).json({
        success: false,
        message:
          "Sender, message, sourceLang, and targetLang are required",
      });
    }

    const result = db
      .prepare(`
        INSERT INTO conversations (
          user_id,
          sender,
          message,
          translated_text,
          source_lang,
          target_lang,
          sign_lang,
          confidence
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .run(
        req.user.userId,
        sender,
        message.trim(),
        translatedText || null,
        sourceLang,
        targetLang,
        signLang || null,
        confidence ?? null
      );

    const savedMessage = db
      .prepare(`
        SELECT
          id,
          user_id AS userId,
          sender,
          message,
          translated_text AS translatedText,
          source_lang AS sourceLang,
          target_lang AS targetLang,
          sign_lang AS signLang,
          confidence,
          created_at AS createdAt
        FROM conversations
        WHERE id = ?
      `)
      .get(result.lastInsertRowid);

    return res.status(201).json({
      success: true,
      message: "Conversation message saved",
      conversation: savedMessage,
    });
  } catch (error) {
    console.error("Save conversation error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to save conversation message",
    });
  }
});

// Get conversation messages for the logged-in user
router.get("/messages", authenticateToken, (req, res) => {
  try {
    const conversations = db
      .prepare(`
        SELECT
          id,
          user_id AS userId,
          sender,
          message,
          translated_text AS translatedText,
          source_lang AS sourceLang,
          target_lang AS targetLang,
          sign_lang AS signLang,
          confidence,
          created_at AS createdAt
        FROM conversations
        WHERE user_id = ?
        ORDER BY created_at ASC, id ASC
      `)
      .all(req.user.userId);

    return res.json({
      success: true,
      conversations,
    });
  } catch (error) {
    console.error("Get conversations error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve conversations",
    });
  }
});

// Delete all conversation messages for the logged-in user
router.delete("/messages", authenticateToken, (req, res) => {
  try {
    const result = db
      .prepare(`
        DELETE FROM conversations
        WHERE user_id = ?
      `)
      .run(req.user.userId);

    return res.json({
      success: true,
      message: "Conversation cleared successfully",
      deletedCount: result.changes,
    });
  } catch (error) {
    console.error("Clear conversation error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to clear conversation",
    });
  }
});

module.exports = router;