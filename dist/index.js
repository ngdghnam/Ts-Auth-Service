"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
// Routes
const auth_route_1 = __importDefault(require("./routes/auth.route"));
// Logger
const logger_1 = __importDefault(require("./config/logger"));
const morgan_1 = __importDefault(require("morgan"));
// Dotenv
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// env
const replicaApp = process.env.APP_NAME || "App_Name";
// Format file.log
const morganFormat = ":method :url :status :response-time ms";
// Logger
app.use((0, morgan_1.default)(morganFormat, {
    stream: {
        write: (message) => {
            const logObject = {
                method: message.split(" ")[0],
                url: message.split(" ")[1],
                status: message.split(" ")[2],
                responseTime: message.split(" ")[3],
            };
            logger_1.default.info(JSON.stringify(logObject));
        },
    },
}));
let dev = {
    name: "Hoai Nam",
    role: "Fullstack developer",
};
app.get("/", (req, res) => {
    // res.send("Hello World from Express Typescript!");
    res.status(200).json({
        Name: dev.name,
        Role: dev.role,
        Request: `Requested is served by: ${replicaApp}`,
    });
});
app.use("/auth", auth_route_1.default);
// 404 Handler
app.use((_, res) => {
    res.status(404).json({ message: "Path not found" });
});
exports.default = app;
