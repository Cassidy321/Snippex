const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 8000;
const connectDatabase = require("./src/config/database");
const snippetRoutes = require("./src/routes/snippet");
const authRoutes = require("./src/routes/auth");
const passport = require("./src/config/passport");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(limiter);
app.use(passport.initialize());
app.use(cookieParser());

connectDatabase();

app.use("/api/snippets", snippetRoutes);
app.use("/api/auth", authRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.listen(PORT);
