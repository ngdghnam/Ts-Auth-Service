"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const router = express_1.default.Router();
router.post("/register", auth_controller_1.default.handleRegister);
router.post("/login", auth_controller_1.default.handleLogin);
router.get("/validate", auth_controller_1.default.handleValidateToken);
router.post("/refresh", auth_controller_1.default.handleRefreshToken);
exports.default = router;
