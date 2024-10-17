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
const mongoose_1 = require("mongoose");
const getAllPostsFromDB = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (searchQuery = "", category = "", page = 1, limit = 10) {
    // Ensure page and limit are valid numbers
    const pageNumber = Math.max(1, Number(page) || 1); // Default to 1 if NaN
    const limitNumber = Math.max(1, Number(limit) || 10); // Default to 10 if NaN
    const skip = (pageNumber - 1) * limitNumber;
    const query = {}; // Use the interface
    // Case-insensitive search
    if (searchQuery) {
        query.title = { $regex: searchQuery, $options: "i" };
    }
    // Clean up category input to avoid issues with quotes
    if (category) {
        query.category = category.replace(/['"]+/g, "").trim(); // Remove both single and double quotes
    }
    // console.log("Query Parameters:", query); // Log the query for debugging
    try {
        // Fetch posts from the database
        const posts = yield post_models_1.default.find(query)
            .populate("author")
            .populate("comments.user")
            .sort("-createdAt")
            .skip(skip)
            .limit(limitNumber);
        const totalPosts = yield post_models_1.default.countDocuments(query); // Total number of posts
        return {
            posts,
            totalPosts,
            totalPages: Math.ceil(totalPosts / limitNumber),
            currentPage: pageNumber,
            hasMore: pageNumber * limitNumber < totalPosts, // Check if there are more posts
        };
    }
    catch (error) {
        console.error("Error fetching posts:", error); // Log any errors
        throw new Error("Could not fetch posts"); // Handle errors appropriately
    }
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
const votePostIntoDB = (userId, postId, action) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield post_models_1.default.findById(postId);
    if (!post) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Post not found");
    }
    if (post.isDeleted) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Post already deleted");
    }
    const upVotesArray = Array.isArray(post.upVotes) ? post.upVotes : [];
    const downVotesArray = Array.isArray(post.downVotes) ? post.downVotes : [];
    // Remove user from both upVotes and downVotes arrays before adding new vote
    post.upVotes = upVotesArray.filter((id) => id.toString() !== userId);
    post.downVotes = downVotesArray.filter((id) => id.toString() !== userId);
    // Apply the appropriate action
    if (action === "upvote") {
        post.upVotes.push(new mongoose_1.Types.ObjectId(userId));
    }
    else if (action === "downvote") {
        post.downVotes.push(new mongoose_1.Types.ObjectId(userId));
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
const getMostLikedPosts = () => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield post_models_1.default.find()
        .populate("author")
        .populate("comments.user")
        .populate("upVotes")
        .populate("downVotes")
        .sort("-createdAt");
    const sortedPosts = posts.sort((a, b) => { var _a, _b; return ((_a = b === null || b === void 0 ? void 0 : b.upVotes) === null || _a === void 0 ? void 0 : _a.length) - ((_b = a === null || a === void 0 ? void 0 : a.upVotes) === null || _b === void 0 ? void 0 : _b.length); });
    const mostLikedPosts = sortedPosts.slice(0, 6);
    return { mostLikedPosts };
});
const getLowestLikedPosts = (_a) => __awaiter(void 0, [_a], void 0, function* ({ searchQuery = "", category = "" }) {
    const query = {};
    // Filter by category if provided
    if (category) {
        query.category = category;
    }
    const posts = yield post_models_1.default.find(query)
        .populate("author")
        .populate("comments.user")
        .populate("upVotes")
        .populate("downVotes")
        .sort("-createdAt");
    const sortedPosts = posts.sort((a, b) => { var _a, _b; return ((_a = b === null || b === void 0 ? void 0 : b.upVotes) === null || _a === void 0 ? void 0 : _a.length) - ((_b = a === null || a === void 0 ? void 0 : a.upVotes) === null || _b === void 0 ? void 0 : _b.length); });
    // Check if there are enough posts before slicing
    let lowestLikedPosts = [];
    if (sortedPosts.length > 6) {
        lowestLikedPosts = sortedPosts.slice(6);
    }
    else {
        lowestLikedPosts = sortedPosts;
    }
    // Apply search query if provided
    if (searchQuery) {
        const queryLowerCase = searchQuery.toLowerCase();
        lowestLikedPosts = lowestLikedPosts.filter((post) => {
            var _a, _b;
            return ((_a = post === null || post === void 0 ? void 0 : post.title) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(queryLowerCase)) ||
                ((_b = post === null || post === void 0 ? void 0 : post.description) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(queryLowerCase));
        });
    }
    return { lowestLikedPosts };
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
    getMostLikedPosts,
    getLowestLikedPosts,
};
