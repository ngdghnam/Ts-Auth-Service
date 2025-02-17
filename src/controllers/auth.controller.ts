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
      process.env.JWT_SECRET_KEY || "gfg_jwt_secret_key",
      process.env.REFRESH_TOKEN_KEY || "refresh_token"
    );
    this.userRepo = new UserRepository();
    this.cryptography = new Cryptography();
  }

  // Đăng ký
  handleRegister: RequestHandler = async (req: Request, res: Response) => {
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

  // Đăng nhập
  handleLogin: RequestHandler = async (req, res) => {
    try {
      if (!req.body.username || !req.body.password) {
        res.status(400).json({ message: "username and password are required" });
        return;
      }

      const user = await this.userRepo.getUserByUserName(req.body.username);
      if (!user) {
        res.status(400).json({ message: `user ${user} not found` });
        return;
      }

      const { password } = req.body;

      if (
        user.userPassword &&
        (await this.cryptography.comparePassword(password, user.userPassword))
      ) {
        const token: string = this.jwtHandler.signToken(
          { id: user.userID },
          { expiresIn: "1h" }
        );

        const refreshToken: string = this.jwtHandler.signToken(
          { id: user.userID, refreshToken: true },
          process.env.JWT_REFRESH_SECRET || "your_refresh_secret_key",
          { expiresIn: "7d" }
        );
        res.status(200).json({ token, refreshToken });
        return;
      }
    } catch (error) {
      console.error("Error in Login:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  handleValidateToken: RequestHandler = async (req: Request, res: Response) => {
    if (!req.headers.authorization) {
      res.status(401).json({ message: "Authorization header is required" });
      return;
    }

    const authHeader = req.headers.authorization.split(" ");
    if (authHeader.length !== 2 || authHeader[0] !== "Bearer") {
      res.status(401).json({ message: "Invalid authorization header" });
      return;
    }

    try {
      const payload = this.jwtHandler.verifyToken(
        authHeader[1],
        process.env.JWT_SECRET || "gfg_jwt_secret_key"
      );

      if (!payload) {
        res.status(401).json({ message: "Invalid token" });
        return;
      }

      const user = await this.userRepo.findUserById(payload.userId);
      if (!user) {
        res.status(404).json({ message: "User not found!" });
        return;
      }

      if (payload.refreshToken) {
        res
          .status(401)
          .json({ message: "Refresh token not allowed for this endpoint" });
        return;
      }

      if (payload.exp && Date.now() >= payload.exp * 1000) {
        res.status(401).json({ message: "Token has expired" });
        return;
      }

      res.status(200).json({ message: "Token is valid" });
      return;
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }
  };

  handleRefreshToken: RequestHandler = async (req: Request, res: Response) => {
    if (!req.body.refreshToken) {
      res.status(400).json({ message: "Refresh token is required" });
      return;
    }

    const payload = this.jwtHandler.verifyToken(
      req.body.refreshToken,
      process.env.JWT_REFRESH_SECRET || "your_refresh_secret_key"
    );

    if (
      !payload ||
      typeof payload !== "object" ||
      !("refreshToken" in payload)
    ) {
      res.status(401).json({ message: "Invalid refresh token" });
      return;
    }

    console.log(payload.refreshToken);

    const user = await this.userRepo.findUserById(payload.userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const token: string = this.jwtHandler.signToken(
      { id: user.userID },
      { expiresIn: "1h" }
    );

    res.status(200).json({ token, refreshToken: req.body.refreshToken });
    return;
  };
}

export default new UserController();
