import express from "express";
import { createWorkspace, getWorkspaces, deleteWorkspace, getWorkspaceMembers, addMemberToWorkspace } from "../controllers/workspace.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getWorkspaces);
router.post("/",protect, createWorkspace);
router.delete("/:id",protect,deleteWorkspace);
router.get("/:id/members", protect, getWorkspaceMembers);
router.post("/:id/members", protect, addMemberToWorkspace);

export default router;


