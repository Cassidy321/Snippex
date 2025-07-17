const express = require("express");
const {
  createSnippet,
  getSnippets,
  getSnippetById,
  updateSnippet,
} = require("../controllers/snippetController");

const router = express.Router();

router.post("/", createSnippet);
router.get("/", getSnippets);
router.get("/:id", getSnippetById);
router.put("/:id", updateSnippet);

module.exports = router;
