import { z } from "zod";

export const voteSchema = z.object({
  type: z.enum(["like", "dislike"], {
    error: "Vote must be either 'like' or 'dislike'",
  }),
});

export type VoteDTO = z.infer<typeof voteSchema>;
