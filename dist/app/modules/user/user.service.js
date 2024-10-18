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
exports.UserServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const user_model_1 = require("./user.model");
const mongoose_1 = __importDefault(require("mongoose"));
const createUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.create(payload);
    return result;
});
const getSingleUserIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    return user;
});
const getAllUsersIntoDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.User.find();
    return users;
});
const updateUserIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const updatedUser = yield user_model_1.User.findOneAndUpdate({ _id: id }, payload, {
        runValidators: true,
        new: true,
    });
    return updatedUser;
});
const deleteUserIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const deletedUser = yield user_model_1.User.findOneAndUpdate({ _id: id }, { isDeleted: true }, { new: true });
    return deletedUser;
});
const getuserFromDB = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.isUserExists(email);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    if (user === null || user === void 0 ? void 0 : user.isDeleted) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "User is deleted!");
    }
    return user;
});
const toggleFollowUserIntoDB = (followingId, followerId) => __awaiter(void 0, void 0, void 0, function* () {
    const followingUser = yield user_model_1.User.findById(followingId);
    const followerUser = yield user_model_1.User.findById(followerId); // Fetch the follower user by ID
    if (!followingUser || !followerUser) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    if ((followingUser === null || followingUser === void 0 ? void 0 : followingUser.isDeleted) || (followerUser === null || followerUser === void 0 ? void 0 : followerUser.isDeleted)) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "User is deleted");
    }
    // Check if the follower is already following
    // Example of converting if needed
    const isFollowing = followingUser.followers.includes(new mongoose_1.default.Types.ObjectId(followerUser._id));
    if (isFollowing) {
        // Unfollow the user
        yield user_model_1.User.findByIdAndUpdate(followingUser._id, { $pull: { following: followerUser._id } }, // Corrected to pull from following
        { new: true });
        yield user_model_1.User.findByIdAndUpdate(followerUser._id, // Pull from the follower
        { $pull: { followers: followingUser._id } }, { new: true });
        return null;
    }
    else {
        // Follow the user
        yield user_model_1.User.findByIdAndUpdate(followerUser._id, { $addToSet: { following: followingUser._id } }, { new: true });
        yield user_model_1.User.findByIdAndUpdate(followingUser._id, { $addToSet: { followers: followerUser._id } }, { new: true });
        return null;
    }
});
const userManageStatus = (id, action) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    if (action === "block") {
        if (user === null || user === void 0 ? void 0 : user.isDeleted) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User is deleted");
        }
        if ((user === null || user === void 0 ? void 0 : user.status) === "block") {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User is blocked");
        }
        const result = yield user_model_1.User.findByIdAndUpdate(user._id, { status: "block" }, { new: true, runValidators: true });
        return result;
    }
    else if (action === "unblock") {
        if ((user === null || user === void 0 ? void 0 : user.status) !== "block") {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User is already active");
        }
        const result = yield user_model_1.User.findByIdAndUpdate(user._id, { status: "active" }, { new: true, runValidators: true });
        return result;
    }
});
const getUserFollowersAndFollowing = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id)
        .populate("followers")
        .populate("following");
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    return {
        followers: user.followers,
        following: user.following,
    };
});
exports.UserServices = {
    toggleFollowUserIntoDB,
    userManageStatus,
    createUserIntoDB,
    getSingleUserIntoDB,
    getAllUsersIntoDB,
    updateUserIntoDB,
    deleteUserIntoDB,
    getuserFromDB,
    getUserFollowersAndFollowing,
};
