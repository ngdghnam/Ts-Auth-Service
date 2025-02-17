import { Request, Response, RequestHandler } from "express";
import JwtHandler from "../utils/jwt";
import UserRepository from "../repositories/userRepo";
import Cryptography from "../utils/cryptography";
import dotenv from "dotenv";

dotenv.config();

class UserController {
  private jwtHandler: JwtHandler;
  private userRepo: UserRepository;
  private cryptography: Cryptography;

  constructor() {
    this.jwtHandler = new JwtHandler(
      process.env.JWT_SECRET_KEY || "your_secret_key"
    );
    this.userRepo = new UserRepository();
    this.cryptography = new Cryptography();
  }

  // Remove the Promise<Response> return type - this was causing the error
  handleRegister: RequestHandler = async (req, res) => {
    try {
      const { username, age, password } = req.body;

      if (!username || !age || !password) {
        res
          .status(400)
          .json({ message: "Username, age, and password are required" });
        return;
      }

      const existingUser = await this.userRepo.getUserByUserName(username);
      if (existingUser) {
        res.status(409).json({ message: `User ${username} already exists` });
        return;
      }

      const hashedPassword = await this.cryptography.hashPassword(password);
      await this.userRepo.createUser({
        userName: username,
        userAge: age,
        userPassword: hashedPassword,
      });

      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Error in handleRegister:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
}

export default new UserController();
