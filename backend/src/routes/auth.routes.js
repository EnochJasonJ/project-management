import express from "express";
import { registerUser, loginUser, oauthSync } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/oauth-sync", oauthSync);

export default router;