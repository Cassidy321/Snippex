import mongoose, { InferSchemaType, Schema } from "mongoose";

const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: [true, "A content is required"],
      maxlength: [1000, "Comment cannot exceed 1000 characters"],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    snippet: {
      type: Schema.Types.ObjectId,
      ref: "Snippet",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

commentSchema.index({ snippet: 1, createdAt: -1 });
commentSchema.index({ author: 1 });

export type Comment = InferSchemaType<typeof commentSchema>;
export const Comment = mongoose.model("Comment", commentSchema);
export type CommentDocument = InstanceType<typeof Comment>;
