router.post("/", async (req, res) => {
  const { language, code, input } = req.body;

  if (!language || !code) {
    return res.status(400).json({ error: "Missing language or code" });
  }

  try {
    const output = await executeCode(language, code, input);
    res.json({ output });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
