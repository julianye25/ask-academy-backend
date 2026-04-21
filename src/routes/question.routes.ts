import { Router } from "express";
import {
	createQuestion,
	deleteQuestion,
	getQuestionById,
	getQuestionsByQuiz,
	updateQuestion,
} from "../controllers/question.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/:quizId", requireAuth, createQuestion);
router.get("/quiz/:quizId", requireAuth, getQuestionsByQuiz);
router.get("/:id", requireAuth, getQuestionById);
router.patch("/:id", requireAuth, updateQuestion);
router.delete("/:id", requireAuth, deleteQuestion);

export default router;
