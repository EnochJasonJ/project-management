import express from "express";
import { registerUser, loginUser, oauthSync, searchUsers } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/oauth-sync", oauthSync);
router.get("/search-users", searchUsers);

export default router;