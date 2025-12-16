export { registerSchema, loginSchema, type RegisterDTO, type LoginDTO } from "./auth.dto";

export {
  createSnippetSchema,
  updateSnippetSchema,
  getSnippetsQuerySchema,
  type CreateSnippetDTO,
  type UpdateSnippetDTO,
  type GetSnippetsQueryDTO,
} from "./snippet.dto";

export { voteSchema, type VoteDTO } from "./vote.dto";

export {
  createCommentSchema,
  updateCommentSchema,
  type CreateCommentDTO,
  type UpdateCommentDTO,
} from "./comment.dto";
