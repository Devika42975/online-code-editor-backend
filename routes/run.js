const express = require("express");
const router = express.Router();
const executeCode = require("../utils/executeCode");

// POST /run
router.post("/", async (req, res) => {
  const { language, code } = req.body;

  if (!language || !code) {
    return res.status(400).json({ error: "Missing language or code" });
  }

  try {
    // Only send code and language (NO input)
    const output = await executeCode(language, code);
    res.json({ output });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
