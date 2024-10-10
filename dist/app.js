"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./app/routes"));
const globalErrorHandler_1 = __importDefault(require("./app/middleware/globalErrorHandler"));
const notFound_1 = __importDefault(require("./app/middleware/notFound"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
//parser
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:5173",
        "https://car-rental-backend-assingment.vercel.app",
        "https://tech-tips-backend.vercel.app",
    ],
    credentials: true,
}));
//application routes
app.use("/api/v1", routes_1.default);
app.get("/", (req, res) => {
    res.send("Welcome to Tech & Tips Hub");
});
app.use(globalErrorHandler_1.default);
app.use(notFound_1.default);
exports.default = app;
