import express from "express";
import { createModule, getModules, updateModule, deleteModule } from "../controllers/module.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { checkWorkspaceAccess } from "../middlewares/workspace.middleware.js";

const router = express.Router();
router.post("/", protect, checkWorkspaceAccess, createModule);
router.get("/:project_id", protect, checkWorkspaceAccess, getModules);
router.patch("/:id", protect, updateModule);
router.delete("/:id", protect, deleteModule);

export default router;


