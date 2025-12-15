import mongoose, { Schema, InferSchemaType } from "mongoose";

export const TECHNOLOGIES = [] as const;

export const USE_CASES = [] as const;

const snippetSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "A title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "A description is required"],
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    code: {
      type: String,
      required: [true, "A code is required"],
      maxlength: [50000, "Code cannot exceed 50000 characters"],
    },
    technology: {
      type: String,
      required: [true, "A technology is required"],
      enum: {
        values: TECHNOLOGIES,
        message: "This technology is not valid",
      },
    },
    useCase: {
      type: String,
      required: [true, "A use case is required"],
      enum: {
        values: USE_CASES,
        message: "This use case is not valid",
      },
    },
    likesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    dislikesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

snippetSchema.index({ title: "text", description: "text" });
snippetSchema.index({ technology: 1, useCase: 1 });
snippetSchema.index({ createdAt: -1 });
snippetSchema.index({ author: 1 });
snippetSchema.index({ isPublic: 1 });

export type Snippet = InferSchemaType<typeof snippetSchema>;
export const Snippet = mongoose.model("Snippet", snippetSchema);
export type SnippetDocument = InstanceType<typeof Snippet>;
