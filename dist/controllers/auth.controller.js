"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_1 = __importDefault(require("../utils/jwt"));
const userRepo_1 = __importDefault(require("../repositories/userRepo"));
const cryptography_1 = __importDefault(require("../utils/cryptography"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class UserController {
    constructor() {
        // Đăng ký
        this.handleRegister = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, age, password } = req.body;
                if (!username || !age || !password) {
                    res
                        .status(400)
                        .json({ message: "Username, age, and password are required" });
                    return;
                }
                const existingUser = yield this.userRepo.getUserByUserName(username);
                if (existingUser) {
                    res.status(409).json({ message: `User ${username} already exists` });
                    return;
                }
                const hashedPassword = yield this.cryptography.hashPassword(password);
                yield this.userRepo.createUser({
                    userName: username,
                    userAge: age,
                    userPassword: hashedPassword,
                });
                res.status(201).json({ message: "User registered successfully" });
            }
            catch (error) {
                console.error("Error in handleRegister:", error);
                res.status(500).json({ message: "Internal Server Error" });
            }
        });
        // Đăng nhập
        this.handleLogin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.body.username || !req.body.password) {
                    res.status(400).json({ message: "username and password are required" });
                    return;
                }
                const user = yield this.userRepo.getUserByUserName(req.body.username);
                if (!user) {
                    res.status(400).json({ message: `user ${user} not found` });
                    return;
                }
                const { password } = req.body;
                if (user.userPassword &&
                    (yield this.cryptography.comparePassword(password, user.userPassword))) {
                    const token = this.jwtHandler.signToken({ id: user.userID }, { expiresIn: "1h" });
                    const refreshToken = this.jwtHandler.signToken({ id: user.userID, refreshToken: true }, process.env.JWT_REFRESH_SECRET || "your_refresh_secret_key", { expiresIn: "7d" });
                    res.status(200).json({ token, refreshToken });
                    return;
                }
            }
            catch (error) {
                console.error("Error in Login:", error);
                res.status(500).json({ message: "Internal Server Error" });
            }
        });
        this.handleValidateToken = (req, res) => __awaiter(this, void 0, void 0, function* () {
            if (!req.headers.authorization) {
                res.status(401).json({ message: "Authorization header is required" });
                return;
            }
            const authHeader = req.headers.authorization.split(" ");
            if (authHeader.length !== 2 || authHeader[0] !== "Bearer") {
                res.status(401).json({ message: "Invalid authorization header" });
                return;
            }
            try {
                const payload = this.jwtHandler.verifyToken(authHeader[1], process.env.JWT_SECRET || "gfg_jwt_secret_key");
                if (!payload) {
                    res.status(401).json({ message: "Invalid token" });
                    return;
                }
                const user = yield this.userRepo.findUserById(payload.userId);
                if (!user) {
                    res.status(404).json({ message: "User not found!" });
                    return;
                }
                if (payload.refreshToken) {
                    res
                        .status(401)
                        .json({ message: "Refresh token not allowed for this endpoint" });
                    return;
                }
                if (payload.exp && Date.now() >= payload.exp * 1000) {
                    res.status(401).json({ message: "Token has expired" });
                    return;
                }
                res.status(200).json({ message: "Token is valid" });
                return;
            }
            catch (error) {
                res.status(401).json({ message: "Invalid token" });
                return;
            }
        });
        this.handleRefreshToken = (req, res) => __awaiter(this, void 0, void 0, function* () {
            if (!req.body.refreshToken) {
                res.status(400).json({ message: "Refresh token is required" });
                return;
            }
            const payload = this.jwtHandler.verifyToken(req.body.refreshToken, process.env.JWT_REFRESH_SECRET || "your_refresh_secret_key");
            if (!payload ||
                typeof payload !== "object" ||
                !("refreshToken" in payload)) {
                res.status(401).json({ message: "Invalid refresh token" });
                return;
            }
            console.log(payload.refreshToken);
            const user = yield this.userRepo.findUserById(payload.userId);
            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            const token = this.jwtHandler.signToken({ id: user.userID }, { expiresIn: "1h" });
            res.status(200).json({ token, refreshToken: req.body.refreshToken });
            return;
        });
        this.jwtHandler = new jwt_1.default(process.env.JWT_SECRET_KEY || "gfg_jwt_secret_key", process.env.REFRESH_TOKEN_KEY || "refresh_token");
        this.userRepo = new userRepo_1.default();
        this.cryptography = new cryptography_1.default();
    }
}
exports.default = new UserController();
