"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class JwtHandler {
    constructor(secret, refreshSecret) {
        this.secret = secret;
        this.refreshSecret = refreshSecret;
    }
    signToken(payload, secretOrOptions, options) {
        if (typeof secretOrOptions === "string") {
            return jsonwebtoken_1.default.sign(payload, secretOrOptions, options || {});
        }
        return jsonwebtoken_1.default.sign(payload, this.secret, secretOrOptions || {});
    }
    // signToken(payload: object, options?: SignOptions): string {
    //   return jwt.sign(payload, this.secret, options || {});
    // }
    // verifyToken(token: string): object | string {
    //   return jwt.verify(token, this.refreshSecret);
    // }
    verifyToken(token, secret) {
        try {
            return jsonwebtoken_1.default.verify(token, secret);
        }
        catch (error) {
            return null;
        }
    }
    decodeToken(token) {
        return jsonwebtoken_1.default.decode(token);
    }
}
exports.default = JwtHandler;
