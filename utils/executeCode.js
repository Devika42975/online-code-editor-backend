const axios = require("axios");

const languageMap = {
  python: 71,
  javascript: 63,
  cpp: 54,
  java: 62,
};

const executeCode = async (language, code) => {
  const language_id = languageMap[language];
  if (!language_id) throw new Error("Unsupported language");

  const headers = {
    "Content-Type": "application/json",
    "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
    "X-RapidAPI-Key": process.env.JUDGE0_API_KEY,
  };

  // Step 1: Submit the code
  const submission = await axios.post(
    "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=false",
    { source_code: code, language_id },
    { headers }
  );

  const token = submission.data.token;

  // Step 2: Poll until complete
  let result;
  while (true) {
    const response = await axios.get(
      `https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=false`,
      { headers }
    );

    result = response.data;

    if (result.status.id > 2) break;
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }

  return result.stdout || result.stderr || result.compile_output || "⚠️ No output";
};

module.exports = executeCode;
