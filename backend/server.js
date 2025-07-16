const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 5000;
const connectDatabase = require("./src/config/database");
const snippetRoutes = require("./src/routes/snippet");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(limiter);

connectDatabase();

app.use("/api/snippets", snippetRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.listen(PORT);
