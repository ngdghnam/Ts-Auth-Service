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
const database_1 = __importDefault(require("../config/database"));
const userModel_1 = __importDefault(require("../models/userModel"));
class UserRepository {
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userName, userAge, userPassword } = user;
            const [result] = yield database_1.default.raw("INSERT INTO users (userName, userAge, userPassword) VALUES (?, ?, ?)", [userName, userAge, userPassword]);
            return result.insertId; // Return the generated userID
        });
    }
    findUserById(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield database_1.default.raw("SELECT * FROM users WHERE userID = ?", [
                userID,
            ]);
            if (rows.length === 0)
                return null;
            return new userModel_1.default(rows[0].userID, rows[0].userName, rows[0].userAge, rows[0].userPassword);
        });
    }
    updateUser(userID, userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userName, userAge, userPassword } = userData;
            const [result] = yield database_1.default.raw("UPDATE users SET userName = ?, userAge = ?, userPassword = ? WHERE userID = ?", [userName, userAge, userPassword, userID]);
            return result.affectedRows > 0;
        });
    }
    deleteUser(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield database_1.default.raw("DELETE FROM users WHERE userID = ?", [
                userID,
            ]);
            return result.affectedRows > 0;
        });
    }
}
exports.default = new UserRepository();
