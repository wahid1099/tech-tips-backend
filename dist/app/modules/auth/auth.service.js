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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const user_model_1 = require("../user/user.model");
const auth_constant_1 = require("./auth.constant");
const config_1 = __importDefault(require("../../config"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const sendMail_1 = require("../../utils/sendMail");
const createLoginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.isUserExists(payload.email);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    // user is deleted
    const userAlreadyDeleted = user === null || user === void 0 ? void 0 : user.isDeleted;
    if (userAlreadyDeleted) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User already deleted");
    }
    // check if password is correct
    const isPasswordMatched = yield user_model_1.User.isPasswordMatched(payload.password, user === null || user === void 0 ? void 0 : user.password);
    if (!isPasswordMatched) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Password is incorrect");
    }
    const jwtPayload = {
        userId: user === null || user === void 0 ? void 0 : user._id,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        name: user.name,
        userName: user.userName,
    };
    // create token
    const accessToken = (0, auth_constant_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    // refresh token
    const refreshToken = (0, auth_constant_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    return {
        accessToken,
        refreshToken,
    };
});
// create change password
const createChangePassword = (payload, userData) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.isUserExists(userData.email);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "This User is not Found");
    }
    // checking is the user is already soft deleted
    const isDeleted = user === null || user === void 0 ? void 0 : user.isDeleted;
    if (isDeleted) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "This user is deleted");
    }
    // checking if the password is correct
    if (!(yield user_model_1.User.isPasswordMatched(payload.oldPassword, user === null || user === void 0 ? void 0 : user.password))) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Password do not matched !");
    }
    // hash new password
    const newHashedPassword = yield bcrypt_1.default.hash(payload.newPassword, Number(config_1.default.bcrypt_salt_rounds));
    yield user_model_1.User.findOneAndUpdate({
        email: userData.email,
        role: userData.role,
    }, {
        password: newHashedPassword,
        passwordChangedAt: new Date(),
    }, {
        new: true,
    });
});
const createRefreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    // check if the token is valid
    const decoded = (0, auth_constant_1.verifyToken)(token, config_1.default.jwt_refresh_secret);
    const { email, iat } = decoded;
    // check if the user exists
    const user = yield user_model_1.User.isUserExists(email);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const userAlreadyDeleted = user === null || user === void 0 ? void 0 : user.isDeleted;
    if (userAlreadyDeleted) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User already deleted");
    }
    // check if jwt issued before password changed
    if (user.passwordChangedAt &&
        user_model_1.User.isJwtIssuedBeforePasswordChanged(user.passwordChangedAt, iat)) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Your password has been changed");
    }
    const jwtPayload = {
        id: user === null || user === void 0 ? void 0 : user._id,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
    };
    // create token
    const accessToken = (0, auth_constant_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    return { accessToken };
});
const forgetPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the user is exist
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "This user is not found !");
    }
    // checking if the user is already deleted
    const isDeleted = user === null || user === void 0 ? void 0 : user.isDeleted;
    if (isDeleted) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "This user is deleted !");
    }
    const jwtPayload = {
        id: user === null || user === void 0 ? void 0 : user._id,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
    };
    const resetToken = (0, auth_constant_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    const resetUILink = `${config_1.default.reset_pass_ui_link}?eamil=${user.email}&token=${resetToken} `;
    (0, sendMail_1.sendEmail)(user.email, resetUILink);
});
exports.AuthService = {
    createLoginUser,
    createChangePassword,
    createRefreshToken,
    forgetPassword,
};
