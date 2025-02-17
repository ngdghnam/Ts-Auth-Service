import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";

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
  res.status(200).json({ Name: dev.name, Role: dev.role });
});

// 404 Handler
app.use((_, res) => {
  res.status(404).send("Path not found!");
});

export default app;
