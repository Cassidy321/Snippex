import { Router } from "express";
import { snippetController } from "@/controllers";
import { validate, authenticate } from "@/middlewares";
import {
  createSnippetSchema,
  updateSnippetSchema,
  getSnippetsQuerySchema,
  paginationQuerySchema,
} from "@/dto";

export const router = Router();

router.get("/", validate({ query: getSnippetsQuerySchema }), snippetController.getAllSnippets);
router.get(
  "/my-snippets",
  authenticate,
  validate({ query: paginationQuerySchema }),
  snippetController.getMySnippets
);
router.get("/:id", snippetController.getOneSnippet);

router.use(authenticate);
router.post("/", validate({ body: createSnippetSchema }), snippetController.createOneSnippet);
router.patch("/:id", validate({ body: updateSnippetSchema }), snippetController.updateOneSnippet);
router.delete("/:id", snippetController.deleteOneSnippet);
