import express, { Router } from "express";
import UserController from "../controllers/auth.controller";

const router: Router = express.Router();

router.post("/register", UserController.handleRegister);
router.post("/login", UserController.handleLogin);
router.get("/validate", UserController.handleValidateToken);
router.post("/refresh", UserController.handleRefreshToken);

export default router;
