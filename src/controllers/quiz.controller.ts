import type { Request, Response } from "express";
import { prisma } from "../config/db";

export const createQuiz = async (req: Request, res: Response) => {
  try {
    const { title, description, userId, categoryId } = req.body;
    const quiz = await prisma.quiz.create({
      data: {
        title,
        description,
        userId,
        categoryId,
      },
    });
    res.status(201).json(quiz);
  } catch (error) {
    console.error("Error creating quiz:", error);
    res.status(500).json({ error: "Failed to create quiz" });
  }
};

export const getQuizzes = async (req: Request, res: Response) => {
  try {
    const quizzes = await prisma.quiz.findMany({
      include: {
        category: true,
        author: true,
      },
    });
    res.status(200).json(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({ error: "Failed to fetch quizzes" });
  }
};
