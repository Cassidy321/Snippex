const express = require("express");
const { createSnippet } = require("../controllers/snippetController");

const router = express.Router();

router.post("/", createSnippet);

module.exports = router;
