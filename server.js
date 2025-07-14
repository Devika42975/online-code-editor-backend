const express = require("express");
const cors = require("cors");
const runRoute = require("./routes/run");
require("dotenv").config();

const app = express(); // ✅ Make sure this is declared BEFORE app.use()

// Enable CORS
app.use(
  cors({
    origin: "*", // Or restrict to your frontend URL if needed
  })
);

app.use(express.json());

// Route for running code
app.use("/run", runRoute);

// Start the server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
