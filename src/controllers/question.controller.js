import { prisma } from "../config/db";

export const createQuestion = async (req, res) => {
    try {
        const { quizId } = req.params;
        const { question, options, correctAnswer, explanation } = req.body;
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        if (!quizId) {
            return res.status(400).json({ error: "quizId is required" });
        }

        if (!question || typeof question !== "string" || !question.trim()) {
            return res.status(400).json({ error: "question is required" });
        }

        if (!Array.isArray(options) || options.length < 2) {
            return res
                .status(400)
                .json({ error: "options must be an array with at least 2 values" });
        }

        const normalizedOptions = options.map((opt) =>
            typeof opt === "string" ? opt.trim() : opt,
        );

        if (normalizedOptions.some((opt) => typeof opt !== "string" || !opt)) {
            return res.status(400).json({ error: "all options must be non-empty strings" });
        }

        if (
            !correctAnswer ||
            typeof correctAnswer !== "string" ||
            !normalizedOptions.includes(correctAnswer.trim())
        ) {
            return res.status(400).json({
                error: "correctAnswer must be a valid option",
            });
        }

        const quiz = await prisma.quiz.findUnique({
            where: { id: quizId },
            select: { id: true, userId: true },
        });

        if (!quiz) {
            return res.status(404).json({ error: "Quiz not found" });
        }

        if (quiz.userId !== userId) {
            return res.status(403).json({ error: "Forbidden" });
        }

        const createdQuestion = await prisma.question.create({
            data: {
                question: question.trim(),
                options: normalizedOptions,
                correctAnswer: correctAnswer.trim(),
                explanation: typeof explanation === "string" ? explanation.trim() : null,
                quizId,
            },
        });

        return res.status(201).json(createdQuestion);
    } catch (error) {
        console.error("Error creating question:", error);
        return res.status(500).json({ error: "Failed to create question" });
    }
};

export const getQuestionsByQuiz = async (req, res) => {
    try {
        const { quizId } = req.params;
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const quiz = await prisma.quiz.findUnique({
            where: { id: quizId },
            select: { id: true, userId: true, isPublic: true },
        });

        if (!quiz) {
            return res.status(404).json({ error: "Quiz not found" });
        }

        if (quiz.userId !== userId && !quiz.isPublic) {
            return res.status(403).json({ error: "Forbidden" });
        }

        const questions = await prisma.question.findMany({
            where: { quizId },
            orderBy: { id: "asc" },
        });

        return res.status(200).json(questions);
    } catch (error) {
        console.error("Error fetching questions:", error);
        return res.status(500).json({ error: "Failed to fetch questions" });
    }
};

export const getQuestionById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const question = await prisma.question.findUnique({
            where: { id },
            include: {
                quiz: {
                    select: { id: true, userId: true, isPublic: true },
                },
            },
        });

        if (!question) {
            return res.status(404).json({ error: "Question not found" });
        }

        if (question.quiz.userId !== userId && !question.quiz.isPublic) {
            return res.status(403).json({ error: "Forbidden" });
        }

        return res.status(200).json(question);
    } catch (error) {
        console.error("Error fetching question:", error);
        return res.status(500).json({ error: "Failed to fetch question" });
    }
};

export const updateQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const { question, options, correctAnswer, explanation } = req.body;
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const existing = await prisma.question.findUnique({
            where: { id },
            include: {
                quiz: {
                    select: { userId: true },
                },
            },
        });

        if (!existing) {
            return res.status(404).json({ error: "Question not found" });
        }

        if (existing.quiz.userId !== userId) {
            return res.status(403).json({ error: "Forbidden" });
        }

        const data = {};

        if (typeof question === "string") {
            if (!question.trim()) {
                return res.status(400).json({ error: "question cannot be empty" });
            }
            data.question = question.trim();
        }

        if (options !== undefined) {
            if (!Array.isArray(options) || options.length < 2) {
                return res
                    .status(400)
                    .json({ error: "options must be an array with at least 2 values" });
            }

            const normalizedOptions = options.map((opt) =>
                typeof opt === "string" ? opt.trim() : opt,
            );

            if (normalizedOptions.some((opt) => typeof opt !== "string" || !opt)) {
                return res.status(400).json({ error: "all options must be non-empty strings" });
            }

            data.options = normalizedOptions;

            const answerToValidate =
                typeof correctAnswer === "string"
                    ? correctAnswer.trim()
                    : existing.correctAnswer;

            if (!normalizedOptions.includes(answerToValidate)) {
                return res.status(400).json({
                    error: "correctAnswer must be a valid option",
                });
            }
        }

        if (correctAnswer !== undefined) {
            if (typeof correctAnswer !== "string" || !correctAnswer.trim()) {
                return res.status(400).json({ error: "correctAnswer is invalid" });
            }

            const optionsToValidate = Array.isArray(data.options)
                ? data.options
                : existing.options;

            if (!optionsToValidate.includes(correctAnswer.trim())) {
                return res.status(400).json({
                    error: "correctAnswer must be a valid option",
                });
            }

            data.correctAnswer = correctAnswer.trim();
        }

        if (explanation !== undefined) {
            data.explanation =
                typeof explanation === "string" && explanation.trim()
                    ? explanation.trim()
                    : null;
        }

        const updatedQuestion = await prisma.question.update({
            where: { id },
            data,
        });

        return res.status(200).json(updatedQuestion);
    } catch (error) {
        console.error("Error updating question:", error);
        return res.status(500).json({ error: "Failed to update question" });
    }
};

export const deleteQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const existing = await prisma.question.findUnique({
            where: { id },
            include: {
                quiz: {
                    select: { userId: true },
                },
            },
        });

        if (!existing) {
            return res.status(404).json({ error: "Question not found" });
        }

        if (existing.quiz.userId !== userId) {
            return res.status(403).json({ error: "Forbidden" });
        }

        await prisma.question.delete({ where: { id } });

        return res.status(200).json({ message: "Question deleted" });
    } catch (error) {
        console.error("Error deleting question:", error);
        return res.status(500).json({ error: "Failed to delete question" });
    }
};
