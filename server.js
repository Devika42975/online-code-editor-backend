require("dotenv").config(); 
const express = require("express");
const cors = require("cors");
const runRoute = require("./routes/run");

const app = express();

app.use(cors({
  origin: "https://online-code-editor-frontend-three.vercel.app/", //replace with actual deployed Vercel URL
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
}));

app.use(express.json());

app.use("/execute", runRoute); // ✅ main route

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
