import type { Request, Response } from "express";
import { prisma } from "../config/db";
import type { AuthenticatedRequest } from "../middleware/auth.middleware";

export const createCategory = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const { name, isPublic = false } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: "Category name is required" });
    }

    const normalizedName = name.trim();

    if (!normalizedName) {
      return res.status(400).json({ error: "Category name is required" });
    }

    const category = await prisma.category.create({
      data: {
        name: normalizedName,
        isPublic: Boolean(isPublic),
        userId,
      },
    });

    return res.status(201).json(category);
  } catch (error) {
    console.error("Error creating category:", error);
    return res.status(500).json({ error: "Failed to create category" });
  }
};

export const getCategories = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const categories = await prisma.category.findMany({
      where: {
        OR: [{ userId }, { isPublic: true }],
      },
      orderBy: {
        name: "asc",
      },
    });

    return res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({ error: "Failed to fetch categories" });
  }
};

export const updateCategoryVisibility = async (
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

    const category = await prisma.category.findUnique({ where: { id } });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    if (category.userId !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { isPublic },
    });

    return res.status(200).json(updatedCategory);
  } catch (error) {
    console.error("Error updating category visibility:", error);
    return res.status(500).json({ error: "Failed to update category visibility" });
  }
};
