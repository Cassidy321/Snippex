import { snippetService } from "@/services";
import { catchAsync } from "@/utils";
import { GetSnippetsQueryDTO, PaginationQueryDTO } from "@/dto";

export const createOneSnippet = catchAsync(async (req, res) => {
  const snippet = await snippetService.createSnippet(req.body, req.user!.id);
  res.status(201).json({ success: true, message: "Snippet created", data: { snippet } });
});

export const getAllSnippets = catchAsync(async (req, res) => {
  const query = req.validated?.query as GetSnippetsQueryDTO;
  const result = await snippetService.getSnippets(query);
  res.json({
    success: true,
    data: { snippets: result.snippets },
    meta: { pagination: result.pagination },
  });
});

export const getOneSnippet = catchAsync(async (req, res) => {
  const snippet = await snippetService.getSnippetById(req.params.id as string, req.user?.id);
  res.json({ success: true, data: { snippet } });
});

export const getMySnippets = catchAsync(async (req, res) => {
  const query = req.validated?.query as PaginationQueryDTO;
  const result = await snippetService.getSnippetsByAuthor(req.user!.id, query);
  res.json({
    success: true,
    data: { snippets: result.snippets },
    meta: { pagination: result.pagination },
  });
});

export const updateOneSnippet = catchAsync(async (req, res) => {
  const snippet = await snippetService.updateSnippet(
    req.params.id as string,
    req.body,
    req.user!.id
  );
  res.json({ success: true, message: "Snippet updated", data: { snippet } });
});

export const deleteOneSnippet = catchAsync(async (req, res) => {
  await snippetService.deleteSnippet(req.params.id as string, req.user!.id);
  res.json({ success: true, message: "Snippet deleted" });
});
