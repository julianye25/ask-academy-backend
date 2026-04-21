import { Router } from "express";
import {
	createCategory,
	getCategories,
	updateCategoryVisibility,
} from "../controllers/category.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", requireAuth, createCategory);
router.get("/", requireAuth, getCategories);
router.patch("/:id/visibility", requireAuth, updateCategoryVisibility);

export default router;