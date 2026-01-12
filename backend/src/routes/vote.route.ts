import { Router } from "express";
import { voteController } from "@/controllers";
import { authenticate, validate } from "@/middlewares";
import { voteSchema, voteParamsSchema } from "@/dto/vote.dto";

export const router = Router();

router.use(authenticate);

router.post(
  "/:snippetId/vote",
  validate({ params: voteParamsSchema, body: voteSchema }),
  voteController.voteSnippet
);

router.delete(
  "/:snippetId/vote",
  validate({ params: voteParamsSchema }),
  voteController.removeVote
);

router.get("/:snippetId/vote", validate({ params: voteParamsSchema }), voteController.getUserVote);
