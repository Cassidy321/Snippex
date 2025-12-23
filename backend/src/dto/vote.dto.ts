import { z } from "zod";

export const voteParamsSchema = z.object({
  snippetId: z.string().min(1, "Snippet id is required"),
});

export const voteSchema = z.object({
  type: z.enum(["like", "dislike"], {
    error: "Vote must be either 'like' or 'dislike'",
  }),
});

export type VoteParamsDTO = z.infer<typeof voteParamsSchema>;
export type VoteDTO = z.infer<typeof voteSchema>;
