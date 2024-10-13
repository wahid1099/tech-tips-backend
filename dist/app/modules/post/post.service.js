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
exports.PostServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const post_models_1 = __importDefault(require("./post.models"));
const user_model_1 = require("../user/user.model");
const getAllPostsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield post_models_1.default.find()
        .populate("author")
        .populate("comments.user")
        .sort("-createdAt");
    return posts;
});
const getSinglePostFromDB = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield post_models_1.default.findById(postId)
        .populate("author")
        .populate("comments.user");
    if (!post) {
        throw new Error("Post not found");
    }
    if (post.isDeleted) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Post already deleted");
    }
    return post;
});
const createPostIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const post = (yield (yield post_models_1.default.create(payload)).populate("author")).populate("comments.user");
    return post;
});
const updatePostIntoDB = (postId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield post_models_1.default.findById(postId);
    if (!post) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Post not found");
    }
    if (post.isDeleted) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Post already deleted");
    }
    const updatedPost = yield post_models_1.default.findByIdAndUpdate(postId, payload, {
        new: true,
        runValidators: true,
    });
    return updatedPost;
});
const deletePostIntoDB = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield post_models_1.default.findById(postId);
    if (!post) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Post not found");
    }
    if (post.isDeleted) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Post already deleted");
    }
    const deletedPost = yield post_models_1.default.findByIdAndUpdate(postId, { isDeleted: true }, { new: true, runValidators: true });
    return deletedPost;
});
const commentIntoDB = (postId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield post_models_1.default.findById(postId);
    if (!post) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Post not found");
    }
    if (post.isDeleted) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Post already deleted");
    }
    const result = yield post_models_1.default.findByIdAndUpdate(postId, {
        $addToSet: { comments: payload },
    }, { new: true, runValidators: true });
    return result;
});
const commentDeleteIntoDB = (postId, commentId) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield post_models_1.default.findById(postId);
    if (!post) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Post not found");
    }
    if (post.isDeleted) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Post already deleted");
    }
    const commentExists = post.comments.some((comment) => { var _a; return ((_a = comment._id) === null || _a === void 0 ? void 0 : _a.toString()) === commentId; });
    if (!commentExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Comments are not found");
    }
    const updatePost = yield post_models_1.default.findByIdAndUpdate(postId, {
        $pull: { comments: { _id: commentId } },
    }, { new: true, runValidators: true });
    return updatePost;
});
const commentsUpdateIntoDB = (postId, commentId, newCommment) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield post_models_1.default.findById(postId);
    if (!post) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Post not found");
    }
    if (post.isDeleted) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Post already deleted");
    }
    const commentIndex = post.comments.findIndex((comment) => { var _a; return ((_a = comment._id) === null || _a === void 0 ? void 0 : _a.toString()) === commentId; });
    if (commentIndex === -1) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Comment not found");
    }
    post.comments[commentIndex].content = newCommment.content;
    const updatedPost = yield post.save();
    return updatedPost;
});
const votePostIntoDB = (postId, action) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield post_models_1.default.findById(postId);
    if (!post) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Post not found");
    }
    if (post.isDeleted) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Post already deleted");
    }
    if (action === "upvote") {
        post.upvotes += 1;
    }
    else if (action === "downvote") {
        post.downVotes += 1;
    }
    else if (action === "removeUpvote") {
        post.upvotes -= 1;
    }
    else if (action === "removeDownvote") {
        post.downVotes -= 1;
    }
    const updatedPost = yield post.save();
    return updatedPost;
});
const myPostsIntoDB = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.isUserExists(email);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User not found");
    }
    if (user.isDeleted) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User already deleted");
    }
    const userId = user === null || user === void 0 ? void 0 : user._id.toString();
    const result = yield post_models_1.default.find({ author: userId, isDeleted: false })
        .populate("author")
        .populate("comments.user")
        .sort("-createdAt");
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Posts not found");
    }
    return result;
});
exports.PostServices = {
    createPostIntoDB,
    getAllPostsFromDB,
    getSinglePostFromDB,
    updatePostIntoDB,
    deletePostIntoDB,
    commentIntoDB,
    commentDeleteIntoDB,
    commentsUpdateIntoDB,
    votePostIntoDB,
    myPostsIntoDB,
};
