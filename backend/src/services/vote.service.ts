import { ApiError } from "@/utils";
import { Vote, Snippet } from "@/models";
import { VoteDTO } from "@/dto/vote.dto";
import { Types } from "mongoose";

export const voteSnippet = async (snippetId: string, userId: string, voteType: VoteDTO["type"]) => {
  if (!Types.ObjectId.isValid(snippetId)) {
    throw new ApiError(400, "Invalid snippet id");
  }

  const snippet = await Snippet.findById(snippetId);
  if (!snippet) {
    throw new ApiError(404, "Snippet not found");
  }

  const existingVote = await Vote.findOne({
    snippet: snippetId,
    user: userId,
  });

  if (existingVote) {
    if (existingVote.type === voteType) {
      throw new ApiError(400, `You already ${voteType}d this snippet`);
    }

    const oldType = existingVote.type;
    existingVote.type = voteType;
    await existingVote.save();

    const updateOp =
      oldType === "like"
        ? { $inc: { likesCount: -1, dislikesCount: 1 } }
        : { $inc: { likesCount: 1, dislikesCount: -1 } };

    await Snippet.findByIdAndUpdate(snippetId, updateOp);

    return existingVote;
  }

  const vote = await Vote.create({
    snippet: snippetId,
    user: userId,
    type: voteType,
  });

  const incrementField = voteType === "like" ? "likesCount" : "dislikesCount";
  await Snippet.findByIdAndUpdate(snippetId, { $inc: { [incrementField]: 1 } });

  return vote;
};

export const removeVote = async (snippetId: string, userId: string) => {
  if (!Types.ObjectId.isValid(snippetId)) {
    throw new ApiError(400, "Invalid snippet id");
  }

  const vote = await Vote.findOne({
    snippet: snippetId,
    user: userId,
  });

  if (!vote) {
    throw new ApiError(404, "Vote not found");
  }

  const decrementField = vote.type === "like" ? "likesCount" : "dislikesCount";
  await Snippet.findByIdAndUpdate(snippetId, { $inc: { [decrementField]: -1 } });

  await vote.deleteOne();

  return { message: "Vote removed successfully" };
};

export const getUserVote = async (snippetId: string, userId: string) => {
  if (!Types.ObjectId.isValid(snippetId)) {
    throw new ApiError(400, "Invalid snippet id");
  }

  const vote = await Vote.findOne({
    snippet: snippetId,
    user: userId,
  });

  return vote ? { type: vote.type } : { type: null };
};
