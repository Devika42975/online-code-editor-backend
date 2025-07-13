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