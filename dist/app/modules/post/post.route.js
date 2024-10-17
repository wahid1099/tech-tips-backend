"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRoutes = void 0;
const express_1 = __importDefault(require("express"));
const post_validation_1 = require("./post.validation");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constant_1 = require("../user/user.constant");
const post_controller_1 = require("./post.controller");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const router = express_1.default.Router();
// Create a post (authenticated user)
router.post("/create-post", (0, auth_1.default)(user_constant_1.USER_ROLE.user), (0, validateRequest_1.default)(post_validation_1.PostValidation.createPostValidation), post_controller_1.PostControllers.createPostFromDB);
// Get all posts
router.get("/", post_controller_1.PostControllers.getAllPostsFromDB);
// Get most-liked posts (specific before dynamic :postId)
router.get("/most-liked", post_controller_1.PostControllers.getMostLikedPostsFromDB);
// Get lowest-liked posts (specific before dynamic :postId)
router.get("/lowest-liked", post_controller_1.PostControllers.getLowestLikedPostsFromDB);
// Get posts created by the current authenticated user (user or admin)
router.get("/my-posts", (0, auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.admin), post_controller_1.PostControllers.myPosts);
// Get a single post by ID
router.get("/:postId", 
// auth(USER_ROLE.user, USER_ROLE.admin), // Uncomment if authentication is required
post_controller_1.PostControllers.getSinglePostFromDB);
// Update a post by ID (authenticated user/admin)
router.put("/:postId", (0, auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.admin), (0, validateRequest_1.default)(post_validation_1.PostValidation.updatePostValidation), post_controller_1.PostControllers.updatePostFromDB);
// Delete a post by ID (authenticated user/admin)
router.delete("/:postId", (0, auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.admin), post_controller_1.PostControllers.deletedPostFromDB);
// Add a comment to a post
router.post("/post-comment/:postId", (0, auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.admin), post_controller_1.PostControllers.commentPosFromDB);
// Delete a comment from a post
router.delete("/delete-comment/:postId/:commentId", (0, auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.admin), post_controller_1.PostControllers.commentDeletFromDB);
// Update a comment on a post
router.put("/update-comment/:postId/:commentId", (0, auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.admin), post_controller_1.PostControllers.updateCommentFromDB);
// Vote on a post (upvote/downvote)
router.put("/:postId/vote", (0, auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.admin), post_controller_1.PostControllers.votePost);
exports.PostRoutes = router;
