import { voteService } from "@/services";
import { catchAsync } from "@/utils";
import { VoteDTO, VoteParamsDTO } from "@/dto/vote.dto";

export const voteSnippet = catchAsync(async (req, res) => {
  const { snippetId } = req.validated?.params as VoteParamsDTO;
  const { type } = req.body as VoteDTO;
  const vote = await voteService.voteSnippet(snippetId, req.user!.id, type);
  res.json({ success: true, data: { vote } });
});

export const removeVote = catchAsync(async (req, res) => {
  const { snippetId } = req.validated?.params as VoteParamsDTO;
  await voteService.removeVote(snippetId, req.user!.id);
  res.json({ success: true, message: "Vote removed" });
});

export const getUserVote = catchAsync(async (req, res) => {
  const { snippetId } = req.validated?.params as VoteParamsDTO;
  const vote = await voteService.getUserVote(snippetId, req.user!.id);
  res.json({ success: true, data: { vote } });
});
