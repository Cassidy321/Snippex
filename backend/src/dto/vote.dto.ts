import { z } from "zod";

export const voteParamsSchema = z.object({
  snippetId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid snippet id"),
});

export const voteSchema = z.object({
  type: z.enum(["like", "dislike"], {
    error: "Vote must be either 'like' or 'dislike'",
  }),
});

export type VoteParamsDTO = z.infer<typeof voteParamsSchema>;
export type VoteDTO = z.infer<typeof voteSchema>;
