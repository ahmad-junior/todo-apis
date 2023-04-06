import Express from "express";
const router = Express.Router();
import AccountController from "../controllers/AccountController.js";

// Register
router.post("/register", AccountController.register);

// Login
router.post("/login", AccountController.login);

// Logout
router.post("/logout", AccountController.logout);

// Refresh Tokens
router.post("/refresh-tokens", AccountController.refreshTokens);

export default router;