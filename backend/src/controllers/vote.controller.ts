import { voteService } from "@/services";
import { catchAsync } from "@/utils";
import { VoteDTO, VoteParamsDTO } from "@/dto/vote.dto";

export const voteSnippet = catchAsync(async (req, res) => {
  const { snippetId } = req.validated?.params as VoteParamsDTO;
  const { type } = req.body as VoteDTO;

  const vote = await voteService.voteSnippet(snippetId, req.user!.id, type);

  res.status(200).json({
    success: true,
    data: vote,
  });
});

export const removeVote = catchAsync(async (req, res) => {
  const { snippetId } = req.validated?.params as VoteParamsDTO;

  const result = await voteService.removeVote(snippetId, req.user!.id);

  res.status(200).json({
    success: true,
    data: result,
  });
});

export const getUserVote = catchAsync(async (req, res) => {
  const { snippetId } = req.validated?.params as VoteParamsDTO;

  const vote = await voteService.getUserVote(snippetId, req.user!.id);

  res.status(200).json({
    success: true,
    data: vote,
  });
});
