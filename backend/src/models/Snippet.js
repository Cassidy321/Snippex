const mongoose = require("mongoose");

const snippetSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title too long (100 characters maximum)"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description too long (500 characters maximum)"],
    },
    code: {
      type: String,
      required: [true, "Code is required"],
      maxlength: [50000, "Code too long (50000 characters maximum)"],
    },
    technology: {
      type: String,
      required: [true, "Technology is required"],
      enum: {
        values: [
          "javascript",
          "typescript",
          "python",
          "java",
          "php",
          "csharp",
          "cpp",
          "go",
          "rust",
          "sql",
          "html",
          "css",
          "react",
          "vue",
          "angular",
          "nodejs",
          "express",
          "django",
          "laravel",
          "dotnet",
        ],
        message: "Invalid technology",
      },
    },
    useCase: {
      type: String,
      required: [true, "Use case is required"],
      enum: {
        values: [
          "crud",
          "auth",
          "database",
          "api",
          "validation",
          "upload",
          "email",
          "date",
          "error-handling",
          "middleware",
          "hooks",
          "components",
          "styling",
          "testing",
          "deployment",
        ],
        message: "Invalid use case",
      },
    },
    codeLength: {
      type: String,
      enum: ["short", "medium", "long"],
    },
    viewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

snippetSchema.index({ title: "text", description: "text" });
snippetSchema.index({ technology: 1, useCase: 1 });
snippetSchema.index({ createdAt: -1 });
snippetSchema.index({ viewCount: -1 });

snippetSchema.pre("save", function (next) {
  const codeLines = this.code.split("\n").length;

  if (codeLines <= 10) {
    this.codeLength = "short";
  } else if (codeLines <= 50) {
    this.codeLength = "medium";
  } else {
    this.codeLength = "long";
  }

  next();
});

module.exports = mongoose.model("Snippet", snippetSchema);