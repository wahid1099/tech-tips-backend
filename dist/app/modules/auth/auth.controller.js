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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const auth_service_1 = require("./auth.service");
const AppError_1 = __importDefault(require("../../error/AppError"));
const createLoginUserIntoDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.AuthService.createLoginUser(req.body);
    const { accessToken, refreshToken } = result;
    res.cookie("refreshToken", refreshToken, {
        secure: config_1.default.node_dev === "production",
        httpOnly: true,
    });
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "User logged in successfully",
        statusCode: http_status_1.default.OK,
        data: { accessToken, refreshToken },
    });
}));
const createChangePasswordIntoDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const passwordData = __rest(req.body, []);
    const result = yield auth_service_1.AuthService.createChangePassword(passwordData, req.user);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Password changed successfully",
        statusCode: http_status_1.default.OK,
        data: result,
    });
}));
const refreshToken = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.cookies;
    const result = yield auth_service_1.AuthService.createRefreshToken(refreshToken);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Token refreshed successfully",
        statusCode: http_status_1.default.OK,
        data: result,
    });
}));
const toggoleUserRoleFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const result = yield auth_service_1.AuthService.toggoleUserRole(userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "User role toggled successfully",
        statusCode: http_status_1.default.OK,
        data: result,
    });
}));
const forgetPasswordFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const result = yield auth_service_1.AuthService.forgetPassword(email);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Reset password link sent to your email",
        statusCode: http_status_1.default.OK,
        data: result,
    });
}));
const resetPasswordFromDb = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { newPassword, email } = req.body;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Authorization token is missing");
    }
    const result = yield auth_service_1.AuthService.resetPassword({ email, newPassword }, token);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Password reset successfully",
        statusCode: http_status_1.default.OK,
        data: result,
    });
}));
exports.AuthController = {
    createLoginUserIntoDB,
    createChangePasswordIntoDB,
    refreshToken,
    forgetPasswordFromDB,
    toggoleUserRoleFromDB,
    resetPasswordFromDb,
};
