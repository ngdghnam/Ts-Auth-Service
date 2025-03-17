import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";

// Routes
import authRouter from "./routes/auth.route";

// Logger
import logger from "./config/logger";
import morgan from "morgan";

// Dotenv
import dotenv from "dotenv";
dotenv.config();

const app: Express = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// env
const replicaApp: string | undefined = process.env.APP_NAME || "App_Name";

// Format file.log
const morganFormat = ":method :url :status :response-time ms";
// Logger
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

let dev: {
  name: string;
  role: string;
} = {
  name: "Hoai Nam",
  role: "Fullstack developer",
};

app.get("/", (req: Request, res: Response) => {
  // res.send("Hello World from Express Typescript!");
  res.status(200).json({
    Name: dev.name,
    Role: dev.role,
    Request: `Requested is served by: ${replicaApp}`,
  });
});

app.use("/auth", authRouter);

// 404 Handler
app.use((_, res) => {
  res.status(404).json({ message: "Path not found" });
});

export default app;
