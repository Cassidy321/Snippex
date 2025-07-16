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

const getSnippets = async (req, res) => {
  try {
    const {
      search,
      technology,
      useCase,
      sortBy = "newest",
      limit,
      page = 1,
      all,
    } = req.query;

    let query = {};

    if (search) {
      query.$text = { $search: search };
    }

    if (technology) {
      query.technology = technology;
    }

    if (useCase) {
      query.useCase = useCase;
    }

    let sortOptions = {};
    switch (sortBy) {
      case "oldest":
        sortOptions = { createdAt: 1 };
        break;
      case "popular":
        sortOptions = { viewCount: -1 };
        break;
      case "newest":
      default:
        sortOptions = { createdAt: -1 };
    }

    let snippetsQuery = Snippet.find(query).sort(sortOptions);

    if (all === "true") {
      const snippets = await snippetsQuery;
      return res.json({
        snippets,
        total: snippets.length,
        hasFilters: !!(search || technology || useCase),
      });
    }

    const limitNum = parseInt(limit) || 20;
    const pageNum = parseInt(page) || 1;
    const skip = (pageNum - 1) * limitNum;

    const snippets = await snippetsQuery.limit(limitNum).skip(skip);

    const total = await Snippet.countDocuments(query);
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      snippets,
      pagination: {
        current: pageNum,
        total: totalPages,
        limit: limitNum,
        count: snippets.length,
        totalSnippets: total,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1,
      },
      filters: {
        search: search || null,
        technology: technology || null,
        useCase: useCase || null,
        sortBy,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: "Error getting snippets",
      message: error.message,
    });
  }
};

module.exports = {
  createSnippet,
  getSnippets,
};
