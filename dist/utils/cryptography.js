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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class Cryptography {
    constructor(saltRounds = 10) {
        this.hashPasswordMiddleware = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.body.password) {
                    req.body.password = yield this.hashPassword(req.body.password);
                }
                next();
            }
            catch (error) {
                res.status(400).json({ error: "Password hashing failed" });
            }
        });
        this.saltRounds = saltRounds;
    }
    hashPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const salt = yield bcryptjs_1.default.genSalt(this.saltRounds);
                return yield bcryptjs_1.default.hash(password, salt);
            }
            catch (error) {
                console.error("Error hashing password:", error);
                throw error;
            }
        });
    }
    comparePassword(plainPassword, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!plainPassword || !hashedPassword) {
                    throw new Error("Both plain and hashed passwords are required");
                }
                return yield bcryptjs_1.default.compare(plainPassword, hashedPassword);
            }
            catch (error) {
                console.error("Error comparing passwords:", error);
                throw error;
            }
        });
    }
}
exports.default = Cryptography;
