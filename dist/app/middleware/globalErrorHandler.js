"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const config_1 = __importDefault(require("../config"));
const handleValidationError_1 = __importDefault(require("../error/handleValidationError"));
const handleCastError_1 = __importDefault(require("../error/handleCastError"));
const handleDuplicateError_1 = __importDefault(require("../error/handleDuplicateError"));
const AppError_1 = __importDefault(require("../error/AppError"));
const handleZodError_1 = __importDefault(require("../error/handleZodError"));
const globalErrorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = err.message || "Something went wrong";
    let errorSource = [
        {
            path: "",
            message: message,
        },
    ];
    if (err instanceof zod_1.ZodError) {
        const simplefiedError = (0, handleZodError_1.default)(err);
        statusCode = simplefiedError === null || simplefiedError === void 0 ? void 0 : simplefiedError.statusCode;
        message = simplefiedError === null || simplefiedError === void 0 ? void 0 : simplefiedError.message;
        errorSource = simplefiedError === null || simplefiedError === void 0 ? void 0 : simplefiedError.errorSource;
    }
    else if ((err === null || err === void 0 ? void 0 : err.name) === "ValidationError") {
        const simplefiedError = (0, handleValidationError_1.default)(err);
        statusCode = simplefiedError === null || simplefiedError === void 0 ? void 0 : simplefiedError.statusCode;
        message = simplefiedError === null || simplefiedError === void 0 ? void 0 : simplefiedError.message;
        errorSource = simplefiedError === null || simplefiedError === void 0 ? void 0 : simplefiedError.errorSource;
    }
    else if ((err === null || err === void 0 ? void 0 : err.name) === "CastError") {
        const simplefiedError = (0, handleCastError_1.default)(err);
        statusCode = simplefiedError === null || simplefiedError === void 0 ? void 0 : simplefiedError.statusCode;
        message = simplefiedError === null || simplefiedError === void 0 ? void 0 : simplefiedError.message;
        errorSource = simplefiedError === null || simplefiedError === void 0 ? void 0 : simplefiedError.errorSource;
    }
    else if ((err === null || err === void 0 ? void 0 : err.code) === 11000) {
        const simplefiedError = (0, handleDuplicateError_1.default)(err);
        statusCode = simplefiedError === null || simplefiedError === void 0 ? void 0 : simplefiedError.statusCode;
        message = simplefiedError === null || simplefiedError === void 0 ? void 0 : simplefiedError.message;
        errorSource = simplefiedError === null || simplefiedError === void 0 ? void 0 : simplefiedError.errorSource;
    }
    else if (err instanceof AppError_1.default) {
        statusCode = err.statusCode;
        message = err.message;
        errorSource = [
            {
                path: "",
                message: err.message,
            },
        ];
    }
    else if (err instanceof Error) {
        message = err === null || err === void 0 ? void 0 : err.message;
        errorSource = [
            {
                path: "",
                message: err.message,
            },
        ];
    }
    return res.status(statusCode).json({
        success: false,
        message,
        errorSource,
        err,
        stack: config_1.default.node_dev === "development" ? err === null || err === void 0 ? void 0 : err.stack : null,
    });
};
exports.default = globalErrorHandler;
