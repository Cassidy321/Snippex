import { ApiError } from "@/utils";
import { Vote, Snippet } from "@/models";
import { VoteDTO } from "@/dto/vote.dto";

export const voteSnippet = async (snippetId: string, userId: string, voteType: VoteDTO["type"]) => {
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

    if (oldType === "like") {
      snippet.likesCount = Math.max(0, snippet.likesCount - 1);
      snippet.dislikesCount += 1;
    } else {
      snippet.dislikesCount = Math.max(0, snippet.dislikesCount - 1);
      snippet.likesCount += 1;
    }
    await snippet.save();

    return existingVote;
  }

  const vote = await Vote.create({
    snippet: snippetId,
    user: userId,
    type: voteType,
  });

  if (voteType === "like") {
    snippet.likesCount += 1;
  } else {
    snippet.dislikesCount += 1;
  }
  await snippet.save();

  return vote;
};

export const removeVote = async (snippetId: string, userId: string) => {
  const vote = await Vote.findOne({
    snippet: snippetId,
    user: userId,
  });

  if (!vote) {
    throw new ApiError(404, "Vote not found");
  }

  const snippet = await Snippet.findById(snippetId);
  if (!snippet) {
    throw new ApiError(404, "Snippet not found");
  }

  if (vote.type === "like") {
    snippet.likesCount = Math.max(0, snippet.likesCount - 1);
  } else {
    snippet.dislikesCount = Math.max(0, snippet.dislikesCount - 1);
  }
  await snippet.save();

  await vote.deleteOne();

  return { message: "Vote removed successfully" };
};

export const getUserVote = async (snippetId: string, userId: string) => {
  const vote = await Vote.findOne({
    snippet: snippetId,
    user: userId,
  });

  return vote ? { type: vote.type } : { type: null };
};
