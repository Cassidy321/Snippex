import { z } from "zod";
import { TECHNOLOGIES, USE_CASES } from "@/models";

export const createSnippetSchema = z.object({
  title: z
    .string()
    .min(1, "A title is requierd")
    .max(100, "The title cannot exceed 100 characters"),
  description: z
    .string()
    .min(1, "A description is required")
    .max(500, "The description cannot exceed 500 characters"),
  code: z
    .string()
    .min(1, "The code is required")
    .max(50000, "The code cannot exceed 50000 characters"),
  technology: z.enum(TECHNOLOGIES, {
    error: "Please select a valid technology",
  }),
  useCase: z.enum(USE_CASES, {
    error: "Please select a valid use case",
  }),
  isPublic: z.boolean().default(true),
});

export const updateSnippetSchema = createSnippetSchema.partial();

export const getSnippetsQuerySchema = z.object({
  search: z.string().optional(),
  technology: z.enum(TECHNOLOGIES).optional(),
  useCase: z.enum(USE_CASES).optional(),
  sortBy: z.enum(["newest", "oldest", "popular"]).default("newest"),
  limit: z.coerce.number().min(1).max(100).default(20),
  page: z.coerce.number().min(1).default(1),
});

export type CreateSnippetDTO = z.infer<typeof createSnippetSchema>;
export type UpdateSnippetDTO = z.infer<typeof updateSnippetSchema>;
export type GetSnippetQueryDTO = z.infer<typeof getSnippetsQuerySchema>;
