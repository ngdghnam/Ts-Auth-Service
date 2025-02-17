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
    constructor() {
        this.database = (0, database_1.default)("users");
    }
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userName, userAge, userPassword } = user;
            const result = yield this.database.insert({
                userName,
                userAge,
                userPassword,
            });
            return result[0]; // MySQL returns the insertId
        });
    }
    findUserById(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            const rows = yield this.database
                .select("*")
                .from("users")
                .where({ userID });
            if (rows.length === 0)
                return null;
            return new userModel_1.default(rows[0].userID, rows[0].userName, rows[0].userAge, rows[0].userPassword);
        });
    }
    updateUser(userID, userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userName, userAge, userPassword } = userData;
            const result = yield this.database
                .where({ userID })
                .update({ userName, userAge, userPassword });
            return result > 0;
        });
    }
    deleteUser(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.database.where({ userID }).del();
            return result > 0;
        });
    }
    getUserByUserName(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const rows = yield this.database
                .select("*")
                .from("users")
                .where({ userName: username });
            if (!rows || rows.length === 0)
                return null;
            const user = rows[0];
            return new userModel_1.default(user.userID, user.userName, user.userAge, user.userPassword);
        });
    }
}
exports.default = UserRepository;
