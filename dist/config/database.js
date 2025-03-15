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
exports.CheckConnection = exports.createDatabase = void 0;
const knex_1 = __importDefault(require("knex"));
const dotenv_1 = __importDefault(require("dotenv"));
const promise_1 = __importDefault(require("mysql2/promise"));
const logger_1 = __importDefault(require("./logger"));
dotenv_1.default.config();
const dbName = process.env.DB_NAME || "your_default_db_name";
const db = (0, knex_1.default)({
    client: "mysql2",
    connection: {
        host: process.env.DB_HOST || "127.0.0.1",
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    },
});
const createDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield promise_1.default.createConnection({
        host: process.env.DB_HOST || "127.0.0.1",
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    });
    try {
        yield connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
        logger_1.default.info(`Database ${dbName} created or already exists`);
        // Switch to the created database
        yield connection.query(`USE ${dbName}`);
        // Create users table based on your User entity
        yield connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        userID INT AUTO_INCREMENT PRIMARY KEY,
        userName VARCHAR(255) NOT NULL UNIQUE,
        userAge INT,
        userPassword VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
        logger_1.default.info("Users table created successfully");
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Database initialization failed: ${error.message}`);
        }
        else {
            throw new Error("Database initialization failed: Unknown error");
        }
    }
    finally {
        yield connection.end();
    }
});
exports.createDatabase = createDatabase;
const CheckConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db.raw("SELECT 1");
        console.log("Database connected successfully!");
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Database connection failed: ${error.message}`);
        }
        else {
            throw new Error("Database connection failed: Unknown error");
        }
    }
});
exports.CheckConnection = CheckConnection;
exports.default = db;
