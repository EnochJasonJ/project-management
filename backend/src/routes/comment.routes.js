import express from "express";
import { createComment, getCommentsByTask, deleteComment, markCommentAsSeen } from "../controllers/comment.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use((req, res, next) => {
    console.log(`Comment Router received: ${req.method} ${req.url}`);
    next();
});

router.post("/", protect, createComment);
router.patch("/acknowledge/:id", protect, markCommentAsSeen);
router.get("/:task_id", protect, getCommentsByTask);
router.delete("/:id", protect, deleteComment);

export default router;
