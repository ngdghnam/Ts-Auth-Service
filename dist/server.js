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
const index_1 = __importDefault(require("./index"));
const database_1 = require("./config/database");
const logger_1 = __importDefault(require("./config/logger"));
const PORT = process.env.PORT || 3000;
const initializeServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, database_1.createDatabase)();
        yield (0, database_1.CheckConnection)();
        index_1.default.listen(PORT, () => {
            console.log(process.env.DB_NAME);
            logger_1.default.info(`Server is running on port ${PORT}`);
        });
    }
    catch (error) {
        logger_1.default.error(error);
        process.exit(1);
    }
});
initializeServer();
