import knex, { Knex } from "knex";
import dotenv from "dotenv";

dotenv.config();

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
