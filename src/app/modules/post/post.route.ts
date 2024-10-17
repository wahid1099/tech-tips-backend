import express from "express";

import { PostValidation } from "./post.validation";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../user/user.constant";
import { PostControllers } from "./post.controller";
import validateRequest from "../../middleware/validateRequest";

const router = express.Router();

// Create a post (authenticated user)
router.post(
  "/create-post",
  auth(USER_ROLE.user),
  validateRequest(PostValidation.createPostValidation),
  PostControllers.createPostFromDB
);

// Get all posts
router.get("/", PostControllers.getAllPostsFromDB);

// Get most-liked posts (specific before dynamic :postId)
router.get("/most-liked", PostControllers.getMostLikedPostsFromDB);

// Get lowest-liked posts (specific before dynamic :postId)
router.get("/lowest-liked", PostControllers.getLowestLikedPostsFromDB);

// Get posts created by the current authenticated user (user or admin)
router.get(
  "/my-posts",
  auth(USER_ROLE.user, USER_ROLE.admin),
  PostControllers.myPosts
);

// Get a single post by ID
router.get(
  "/:postId",
  // auth(USER_ROLE.user, USER_ROLE.admin), // Uncomment if authentication is required
  PostControllers.getSinglePostFromDB
);

// Update a post by ID (authenticated user/admin)
router.put(
  "/:postId",
  auth(USER_ROLE.user, USER_ROLE.admin),
  validateRequest(PostValidation.updatePostValidation),
  PostControllers.updatePostFromDB
);

// Delete a post by ID (authenticated user/admin)
router.delete(
  "/:postId",
  auth(USER_ROLE.user, USER_ROLE.admin),
  PostControllers.deletedPostFromDB
);

// Add a comment to a post
router.post(
  "/post-comment/:postId",
  auth(USER_ROLE.user, USER_ROLE.admin),
  PostControllers.commentPosFromDB
);

// Delete a comment from a post
router.delete(
  "/delete-comment/:postId/:commentId",
  auth(USER_ROLE.user, USER_ROLE.admin),
  PostControllers.commentDeletFromDB
);

// Update a comment on a post
router.put(
  "/update-comment/:postId/:commentId",
  auth(USER_ROLE.user, USER_ROLE.admin),
  PostControllers.updateCommentFromDB
);

// Vote on a post (upvote/downvote)
router.put(
  "/:postId/vote",
  auth(USER_ROLE.user, USER_ROLE.admin),
  PostControllers.votePost
);

export const PostRoutes = router;
