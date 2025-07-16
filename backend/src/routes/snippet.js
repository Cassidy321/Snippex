const express = require("express");
const {
  createSnippet,
  getSnippets,
  getSnippetById,
} = require("../controllers/snippetController");

const router = express.Router();

router.post("/", createSnippet);
router.get("/", getSnippets);
router.get("/:id", getSnippetById);

module.exports = router;
