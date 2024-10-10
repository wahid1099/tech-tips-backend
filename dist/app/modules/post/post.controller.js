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
exports.PostControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const post_service_1 = require("./post.service");
const AppError_1 = __importDefault(require("../../error/AppError"));
const createPostFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_service_1.PostServices.createPostIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Post created successfully",
        statusCode: http_status_1.default.CREATED,
        data: result,
    });
}));
const getAllPostsFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_service_1.PostServices.getAllPostsFromDB();
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "All posts fetched successfully",
        statusCode: http_status_1.default.OK,
        data: result,
    });
}));
const getSinglePostFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.postId;
    const result = yield post_service_1.PostServices.getSinglePostFromDB(postId);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Post fetched successfully",
        statusCode: http_status_1.default.OK,
        data: result,
    });
}));
const updatePostFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.postId;
    const result = yield post_service_1.PostServices.updatePostIntoDB(postId, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Post updated successfully",
        statusCode: http_status_1.default.OK,
        data: result,
    });
}));
const deletedPostFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.postId;
    const result = yield post_service_1.PostServices.deletePostIntoDB(postId);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Post deleted successfully",
        statusCode: http_status_1.default.OK,
        data: result,
    });
}));
const commentPosFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.postId;
    const result = yield post_service_1.PostServices.commentIntoDB(postId, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Commented successfully",
        statusCode: http_status_1.default.OK,
        data: result,
    });
}));
const commentDeletFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId, commentId } = req.params;
    const result = yield post_service_1.PostServices.commentDeleteIntoDB(postId, commentId);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Comment deleted successfully",
        statusCode: http_status_1.default.OK,
        data: result,
    });
}));
const updateCommentFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId, commentId } = req.params;
    const result = yield post_service_1.PostServices.commentsUpdateIntoDB(postId, commentId, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Comment updated successfully",
        statusCode: http_status_1.default.OK,
        data: result,
    });
}));
const votePost = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    const { action } = req.body;
    if (!["upvote", "downvote"].includes(action)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid action");
    }
    const result = yield post_service_1.PostServices.votePostIntoDB(postId, action);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Post voted successfully",
        statusCode: http_status_1.default.OK,
        data: result,
    });
}));
const myPosts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.user.email;
    const result = yield post_service_1.PostServices.myPostsIntoDB(email);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Posts fetched successfully",
        statusCode: http_status_1.default.OK,
        data: result,
    });
}));
exports.PostControllers = {
    createPostFromDB,
    getAllPostsFromDB,
    getSinglePostFromDB,
    updatePostFromDB,
    deletedPostFromDB,
    commentPosFromDB,
    commentDeletFromDB,
    updateCommentFromDB,
    votePost,
    myPosts,
};
