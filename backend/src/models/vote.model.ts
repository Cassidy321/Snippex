import mongoose, { Schema, InferSchemaType } from "mongoose";

const voteSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    snippet: {
      type: Schema.Types.ObjectId,
      ref: "Snippet",
      required: true,
    },
    type: {
      type: String,
      enum: ["like", "dislike"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

voteSchema.index({ user: 1, snippet: 1 }, { unique: true });
voteSchema.index({ snippet: 1 });

export type Vote = InferSchemaType<typeof voteSchema>;
export const Vote = mongoose.model("Vote", voteSchema);
export type VoteDocument = InstanceType<typeof Vote>;
