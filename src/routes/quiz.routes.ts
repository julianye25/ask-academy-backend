import { Router } from "express";
import {
	createQuiz,
	getQuizzes,
	updateQuizVisibility,
} from "../controllers/quiz.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", requireAuth, createQuiz);
router.get("/", requireAuth, getQuizzes);
router.patch("/:id/visibility", requireAuth, updateQuizVisibility);

export default router;
