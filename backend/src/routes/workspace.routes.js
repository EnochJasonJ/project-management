import express from "express";
import { createWorkspace, getWorkspaces, deleteWorkspace } from "../controllers/workspace.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getWorkspaces);
router.post("/",protect, createWorkspace);
router.delete("/:id",protect,deleteWorkspace);

export default router;


