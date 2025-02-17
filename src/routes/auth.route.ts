import express, { Router } from "express";
import UserController from "../controllers/auth.controller";

const router: Router = express.Router();

router.post("/register", UserController.handleRegister);

export default router;
