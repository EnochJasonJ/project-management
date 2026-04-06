import express from "express";
import { createProject, getProjects, getProjectById, updateProject, deleteProject } from "../controllers/project.controller.js";
import {protect} from "../middlewares/auth.middleware.js";
import { checkWorkspaceAccess } from "../middlewares/workspace.middleware.js";
import { checkProjectAccess } from "../middlewares/project.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { requireProjectRole } from "../middlewares/projectRole.middleware.js";

const router = express.Router();
router.post("/",protect, checkWorkspaceAccess, createProject);
router.get("/", protect, checkWorkspaceAccess, getProjects);
router.get("/:id", protect, checkProjectAccess, getProjectById);
router.patch("/:id", protect, checkProjectAccess, updateProject);
router.delete("/:id", protect,checkWorkspaceAccess, checkProjectAccess, 
    requireProjectRole(["owner","manager"]), deleteProject);

export default router;



