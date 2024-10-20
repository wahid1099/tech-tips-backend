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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
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
    // Check if the user exists
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "This user is not found!");
    }
    // Check if the user is already deleted
    if (user.isDeleted) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "This user is deleted!");
    }
    // Create JWT payload
    const jwtPayload = {
        id: user._id.toString(), // Change userId to id for consistency
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        type: "password_reset",
    };
    // Generate the reset token
    const resetToken = (0, auth_constant_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, "5m");
    // Construct the reset password link
    const reset_pass_ui_link = "https://techtipshubwahid.netlify.app/reset-password";
    const resetUILink = `${reset_pass_ui_link}?email=${user.email}&token=${resetToken}`;
    // Send the email with the reset link
    yield (0, sendMail_1.sendEmail)(user.email, resetUILink);
});
const toggoleUserRole = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    if (user.isDeleted) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User already deleted");
    }
    if (user.status === "block") {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User is blocked");
    }
    const updateRole = user.role === "user" ? "admin" : "user";
    const updateUserRole = yield user_model_1.User.findByIdAndUpdate(userId, { role: updateRole }, { new: true });
    return updateUserRole;
});
const resetPassword = (payload, token) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the user exists
    const user = yield user_model_1.User.isUserExists(payload.email);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    // Check if the user is deleted
    if (user.isDeleted) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "This user is already deleted!");
    }
    // Check if the user is blocked
    if (user.status === "block") {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "This user is blocked!");
    }
    // Verify the token
    let decoded;
    try {
        decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
    }
    catch (err) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid or expired token!");
    }
    // Ensure that the token's payload matches the user's ID
    if (user._id.toString() !== decoded.id) {
        // Make sure to match the key here
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "You are forbidden!");
    }
    // Hash the new password
    const newHashedPassword = yield bcrypt_1.default.hash(payload.newPassword, Number(config_1.default.bcrypt_salt_rounds));
    // Update the user's password
    const updatedUser = yield user_model_1.User.findOneAndUpdate({ _id: user._id }, { password: newHashedPassword }, { new: true } // Return the updated user object
    );
    return updatedUser; // Return updated user object
});
exports.AuthService = {
    createLoginUser,
    createChangePassword,
    createRefreshToken,
    forgetPassword,
    toggoleUserRole,
    resetPassword,
};
