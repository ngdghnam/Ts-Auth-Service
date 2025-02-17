"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./index"));
const database_1 = require("./config/database");
const logger_1 = __importDefault(require("./config/logger"));
const PORT = process.env.PORT || 3000;
(0, database_1.CheckConnection)()
    .then(() => {
    index_1.default.listen(PORT, () => {
        logger_1.default.info(`Server is running on port ${PORT}`);
    });
})
    .catch((e) => {
    logger_1.default.error(e);
    process.exit(1);
});
