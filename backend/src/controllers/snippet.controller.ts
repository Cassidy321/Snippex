import { snippetService } from "@/services";
import { catchAsync } from "@/utils";
import { GetSnippetsQueryDTO } from "@/dto";

export const createOneSnippet = catchAsync(async (req, res) => {
  const snippet = await snippetService.createSnippet(req.body, req.user!.id);
  res.status(201).json({ message: "Snippet created", snippet });
});

export const getAllSnippets = catchAsync(async (req, res) => {
  const query = req.validated?.query as GetSnippetsQueryDTO;
  const result = await snippetService.getSnippets(query);
  res.json(result);
});

export const getOneSnippet = catchAsync(async (req, res) => {
  const snippet = await snippetService.getSnippetById(req.params.id!);
  res.json(snippet);
});

export const getMySnippets = catchAsync(async (req, res) => {
  const snippets = await snippetService.getSnippetsByAuthor(req.user!.id);
  res.json(snippets);
});

export const updateOneSnippet = catchAsync(async (req, res) => {
  const snippet = await snippetService.updateSnippet(req.params.id!, req.body, req.user!.id);
  res.json({ message: "Snippet updated", snippet });
});

export const deleteOneSnippet = catchAsync(async (req, res) => {
  await snippetService.deleteSnippet(req.params.id!, req.user!.id);
  res.json({ message: "Snippet deleted" });
});
