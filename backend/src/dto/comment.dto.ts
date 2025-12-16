import { z } from "zod";

export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, "A comment cannot be empty")
    .max(1000, "The comment cannot exceed 1000 characters"),
});

export const updateCommentSchema = createCommentSchema;

export type CreateCommentDTO = z.infer<typeof createCommentSchema>;
export type UpdateCommentDTO = z.infer<typeof updateCommentSchema>;
