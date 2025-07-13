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
