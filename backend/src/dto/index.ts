export { registerSchema, loginSchema, type RegisterDTO, type LoginDTO } from "./auth.dto";

export {
  createSnippetSchema,
  updateSnippetSchema,
  getSnippetsQuerySchema,
  paginationQuerySchema,
  type CreateSnippetDTO,
  type UpdateSnippetDTO,
  type GetSnippetsQueryDTO,
  type PaginationQueryDTO,
} from "./snippet.dto";

export { voteSchema, type VoteDTO } from "./vote.dto";

export {
  createCommentSchema,
  updateCommentSchema,
  type CreateCommentDTO,
  type UpdateCommentDTO,
} from "./comment.dto";
