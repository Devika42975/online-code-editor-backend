// ✅ server.js (backend)
require("dotenv").config(); 
console.log("Loaded API KEY:", process.env.JUDGE0_API_KEY);
const express = require("express");
const cors = require("cors");
const runRoute = require("./routes/run");

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// 👇 Updated route
app.use("/execute", runRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// ✅ .env (do NOT commit this file to GitHub)
// PORT=5000
// JUDGE0_API_KEY=your_rapidapi_key
// JUDGE0_API_HOST=judge0-ce.p.rapidapi.com

// ✅ routes/run.js
const express = require("express");
const router = express.Router();
const executeCode = require("../utils/executeCode");

router.post("/", async (req, res) => {
  const { language, code } = req.body;

  if (!language || !code) {
    return res.status(400).json({ error: "Missing language or code" });
  }

  try {
    const output = await executeCode(language, code);
    res.json({ output });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

// ✅ utils/executeCode.js
const axios = require("axios");

const languageMap = {
  python: 71,
  javascript: 63,
  cpp: 54,
  java: 62,
};

const JUDGE0_API = "https://judge0-ce.p.rapidapi.com";
const headers = {
  "X-RapidAPI-Key": process.env.JUDGE0_API_KEY,
  "X-RapidAPI-Host": process.env.JUDGE0_API_HOST,
  "content-type": "application/json",
};

const executeCode = async (language, code) => {
  const language_id = languageMap[language];
  if (!language_id) throw new Error("Unsupported language");

  const submission = await axios.post(
    `${JUDGE0_API}/submissions?base64_encoded=false&wait=false`,
    { source_code: code, language_id },
    { headers }
  );

  const token = submission.data.token;

  let result;
  for (let i = 0; i < 20; i++) {
    const statusRes = await axios.get(
      `${JUDGE0_API}/submissions/${token}?base64_encoded=false`,
      { headers }
    );

    if (statusRes.data.status.id <= 2) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } else {
      result = statusRes.data;
      break;
    }
  }

  if (!result) throw new Error("Execution timeout");

  return result.stdout || result.stderr || result.compile_output || "No output";
};

module.exports = executeCode;

// ✅ frontend App.jsx (only handleRun updated)
const handleRun = async () => {
  const code = currentFiles.find((f) => f.name === activeFile)?.code || "";

  try {
    const res = await axios.post("http://localhost:5000/execute", {
      language: selectedLanguage, // Send "python", not 71
      code,
    });
    setOutput(res.data.output);
  } catch (err) {
    setOutput("Execution error: " + (err.response?.data?.error || err.message));
  }
};
