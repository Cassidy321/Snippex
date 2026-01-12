import { Snippet } from "@/models";
import { ApiError } from "@/utils";
import { CreateSnippetDTO, UpdateSnippetDTO, GetSnippetsQueryDTO } from "@/dto";
import { Types } from "mongoose";

export const createSnippet = async (data: CreateSnippetDTO, authorId: string) => {
  return Snippet.create({
    ...data,
    author: new Types.ObjectId(authorId),
  });
};

export const getSnippets = async (query: GetSnippetsQueryDTO) => {
  const { search, technology, useCase, sortBy, limit, page } = query;

  const filter: Record<string, unknown> = { isPublic: true };

  if (search) {
    filter.$text = { $search: search };
  }

  if (technology) {
    filter.technology = technology;
  }

  if (useCase) {
    filter.useCase = useCase;
  }

  const sortOptions: Record<string, 1 | -1> =
    sortBy === "oldest"
      ? { createdAt: 1 }
      : sortBy === "popular"
        ? { likesCount: -1 }
        : { createdAt: -1 };

  const skip = (page - 1) * limit;

  const [snippets, total] = await Promise.all([
    Snippet.find(filter).sort(sortOptions).limit(limit).skip(skip).populate("author", "username"),
    Snippet.countDocuments(filter),
  ]);

  return {
    snippets,
    pagination: {
      current: page,
      total: Math.ceil(total / limit),
      limit,
      count: snippets.length,
      totalSnippets: total,
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    },
  };
};

export const getSnippetById = async (id: string, requestingUserId?: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "This snippet id does not look right");
  }

  const snippet = await Snippet.findById(id).populate("author", "username");

  if (!snippet) {
    throw new ApiError(404, "This snippet does not exist");
  }

  if (!snippet.isPublic && snippet.author._id.toString() !== requestingUserId) {
    throw new ApiError(404, "This snippet does not exist");
  }

  return snippet;
};

export const getSnippetsByAuthor = async (authorId: string) => {
  return Snippet.find({ author: authorId }).sort({ createdAt: -1 });
};

export const updateSnippet = async (id: string, data: UpdateSnippetDTO, userId: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "This snippet id does not look right");
  }

  const snippet = await Snippet.findById(id);

  if (!snippet) {
    throw new ApiError(404, "This snippet does not exist");
  }

  if (snippet.author.toString() !== userId) {
    throw new ApiError(403, "You can only update your own snippets");
  }

  Object.assign(snippet, data);
  await snippet.save();

  return snippet;
};

export const deleteSnippet = async (id: string, userId: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "This snippet id does not look right");
  }

  const snippet = await Snippet.findById(id);

  if (!snippet) {
    throw new ApiError(404, "This snippet does not exist");
  }

  if (snippet.author.toString() !== userId) {
    throw new ApiError(403, "You can only delete your own snippets");
  }

  await snippet.deleteOne();
};
