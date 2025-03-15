import knex, { Knex } from "knex";
import dotenv from "dotenv";
import mysql from "mysql2/promise";
import logger from "./logger";

dotenv.config();

const dbName = process.env.DB_NAME || "your_default_db_name";

const db: Knex = knex({
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
});

export const createDatabase = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    logger.info(`Database ${dbName} created or already exists`);

    // Switch to the created database
    await connection.query(`USE ${dbName}`);

    // Create users table based on your User entity
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        userID INT AUTO_INCREMENT PRIMARY KEY,
        userName VARCHAR(255) NOT NULL UNIQUE,
        userAge INT,
        userPassword VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    logger.info("Users table created successfully");
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Database initialization failed: ${error.message}`);
    } else {
      throw new Error("Database initialization failed: Unknown error");
    }
  } finally {
    await connection.end();
  }
};

export const CheckConnection = async () => {
  try {
    await db.raw("SELECT 1");
    console.log("Database connected successfully!");
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Database connection failed: ${error.message}`);
    } else {
      throw new Error("Database connection failed: Unknown error");
    }
  }
};

export default db;
