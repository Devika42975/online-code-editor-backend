require("dotenv").config(); 
console.log("Loaded API KEY:", process.env.JUDGE0_API_KEY);

const express = require("express");
const cors = require("cors");
const runRoute = require("./routes/run");

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// 👇 This matches frontend axios URL: http://localhost:5000/execute
app.use("/execute", runRoute);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

