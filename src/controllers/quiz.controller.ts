import type { Request, Response } from "express";
import { prisma } from "../config/db";
import type { AuthenticatedRequest } from "../middleware/auth.middleware";

export const createQuiz = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, description, categoryId, isPublic = false } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!title || typeof title !== "string") {
      return res.status(400).json({ error: "Quiz title is required" });
    }

    if (!categoryId || typeof categoryId !== "string") {
      return res.status(400).json({ error: "categoryId is required" });
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    if (category.userId !== userId) {
      return res
        .status(403)
        .json({ error: "You can only use your own categories" });
    }

    const quiz = await prisma.quiz.create({
      data: {
        title,
        description,
        userId,
        categoryId,
        isPublic: Boolean(isPublic),
      },
    });

    return res.status(201).json(quiz);
  } catch (error) {
    console.error("Error creating quiz:", error);
    return res.status(500).json({ error: "Failed to create quiz" });
  }
};

export const getQuizzes = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const quizzes = await prisma.quiz.findMany({
      where: {
        OR: [{ userId }, { isPublic: true }],
      },
      include: {
        category: true,
        author: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return res.status(500).json({ error: "Failed to fetch quizzes" });
  }
};

export const updateQuizVisibility = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const { isPublic } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (typeof isPublic !== "boolean") {
      return res.status(400).json({ error: "isPublic must be boolean" });
    }

    const quiz = await prisma.quiz.findUnique({ where: { id } });

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    if (quiz.userId !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const updatedQuiz = await prisma.quiz.update({
      where: { id },
      data: { isPublic },
    });

    return res.status(200).json(updatedQuiz);
  } catch (error) {
    console.error("Error updating quiz visibility:", error);
    return res.status(500).json({ error: "Failed to update quiz visibility" });
  }
};
