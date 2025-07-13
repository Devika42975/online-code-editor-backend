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

  // Step 1: Create submission
  const submissionRes = await axios.post(
    "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=false",
    {
      source_code: code,
      language_id,
    },
    {
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        "X-RapidAPI-Key": process.env.JUDGE0_API_KEY,
      },
    }
  );

  const token = submissionRes.data.token;

  // Step 2: Poll until complete
  let result;
  let status = { id: 1 };
  while (status.id <= 2) {
    const response = await axios.get(
      `https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=false`,
      {
        headers: {
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          "X-RapidAPI-Key": process.env.JUDGE0_API_KEY,
        },
      }
    );

    result = response.data;
    status = result.status;

    if (status.id <= 2) {
      await new Promise((res) => setTimeout(res, 1500)); // wait before retry
    }
  }

  return result.stdout || result.stderr || result.compile_output || "No output returned.";
};

module.exports = executeCode;
