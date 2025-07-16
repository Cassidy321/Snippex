const { Snippet } = require("../models");

const createSnippet = async (req, res) => {
  try {
    const { title, description, code, technology, useCase } = req.body;

    if (!title || !code || !technology || !useCase) {
      return res.status(400).json({
        error: "Missing fields",
        required: ["title", "code", "technology", "useCase"],
      });
    }

    const snippet = new Snippet({
      title,
      description,
      code,
      technology,
      useCase,
    });

    const savedSnippet = await snippet.save();

    res.status(201).json({
      message: "Snippet created",
      snippet: savedSnippet,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Validation failed",
        details: error.message,
      });
    }

    res.status(500).json({
      error: "Server error",
      message: error.message,
    });
  }
};

module.exports = {
  createSnippet,
};
