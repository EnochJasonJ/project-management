import express from "express";
import { createTask, getTasks, updateTask, deleteTask } from "../controllers/task.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create", protect, createTask);
router.get("/list/:module_id", protect, getTasks);
router.patch("/:id", protect, updateTask);
router.delete("/:id", protect, deleteTask);

export default router;
