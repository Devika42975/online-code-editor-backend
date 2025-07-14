const express = require("express");
const cors = require("cors");
const runRoute = require("./routes/run");
require("dotenv").config();

const app = express();

// ✅ Allow Vercel frontend (or all for testing)
app.use(cors({
  origin: "*"
}));

app.use(express.json());
app.use("/run", runRoute);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
