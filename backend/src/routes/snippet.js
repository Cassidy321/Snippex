const express = require("express");
const {
  createSnippet,
  getSnippets,
} = require("../controllers/snippetController");

const router = express.Router();

router.post("/", createSnippet);
router.get("/", getSnippets);

module.exports = router;
