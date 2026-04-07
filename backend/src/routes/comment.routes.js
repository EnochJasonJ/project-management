import express from "express";
import { createComment, getCommentsByTask, deleteComment } from "../controllers/comment.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createComment);
router.get("/:task_id", protect, getCommentsByTask);
router.delete("/:id", protect, deleteComment);

export default router;
