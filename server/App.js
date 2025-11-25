// index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const apodRoutes = require("./routes/apodRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/apod", apodRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
