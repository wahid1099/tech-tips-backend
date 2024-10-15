import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PostServices } from "./post.service";
import AppError from "../../error/AppError";

const createPostFromDB = catchAsync(async (req, res) => {
  const result = await PostServices.createPostIntoDB(req.body);
  sendResponse(res, {
    success: true,
    message: "Post created successfully",
    statusCode: httpStatus.CREATED,
    data: result,
  });
});

const getAllPostsFromDB = catchAsync(async (req, res) => {
  const searchQuery = req.query.searchQuery
    ? String(req.query.searchQuery)
    : "";
  const category = req.query.category ? String(req.query.category) : "";

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const result = await PostServices.getAllPostsFromDB(
    searchQuery,
    category,
    page,
    limit
  );

  sendResponse(res, {
    success: true,
    message: "All posts fetched successfully",
    statusCode: httpStatus.OK,
    data: result.posts,
    pagination: {
      totalPosts: result.totalPosts,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      hasMore: result.hasMore,
    },
  });
});

const getSinglePostFromDB = catchAsync(async (req, res) => {
  const postId = req.params.postId;

  const result = await PostServices.getSinglePostFromDB(postId);
  sendResponse(res, {
    success: true,
    message: "Post fetched successfully",
    statusCode: httpStatus.OK,
    data: result,
  });
});
const updatePostFromDB = catchAsync(async (req, res) => {
  const postId = req.params.postId;
  const result = await PostServices.updatePostIntoDB(postId, req.body);
  sendResponse(res, {
    success: true,
    message: "Post updated successfully",
    statusCode: httpStatus.OK,
    data: result,
  });
});

const deletedPostFromDB = catchAsync(async (req, res) => {
  const postId = req.params.postId;
  const result = await PostServices.deletePostIntoDB(postId);
  sendResponse(res, {
    success: true,
    message: "Post deleted successfully",
    statusCode: httpStatus.OK,
    data: result,
  });
});

const commentPosFromDB = catchAsync(async (req, res) => {
  const postId = req.params.postId;
  const result = await PostServices.commentIntoDB(postId, req.body);
  sendResponse(res, {
    success: true,
    message: "Commented successfully",
    statusCode: httpStatus.OK,
    data: result,
  });
});

const commentDeletFromDB = catchAsync(async (req, res) => {
  const { postId, commentId } = req.params;
  const result = await PostServices.commentDeleteIntoDB(postId, commentId);
  sendResponse(res, {
    success: true,
    message: "Comment deleted successfully",
    statusCode: httpStatus.OK,
    data: result,
  });
});

const updateCommentFromDB = catchAsync(async (req, res) => {
  const { postId, commentId } = req.params;
  const result = await PostServices.commentsUpdateIntoDB(
    postId,
    commentId,
    req.body
  );
  sendResponse(res, {
    success: true,
    message: "Comment updated successfully",
    statusCode: httpStatus.OK,
    data: result,
  });
});
const votePost = catchAsync(async (req, res) => {
  const { postId } = req.params;
  const { action } = req.body;
  const userId = req.user.userId;

  if (!["upvote", "downvote"].includes(action)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid action");
  }
  const result = await PostServices.votePostIntoDB(userId, postId, action);
  sendResponse(res, {
    success: true,
    message: "Post voted successfully",
    statusCode: httpStatus.OK,
    data: result,
  });
});
const myPosts = catchAsync(async (req, res) => {
  const email = req.user.email;
  const result = await PostServices.myPostsIntoDB(email);
  sendResponse(res, {
    success: true,
    message: "Posts fetched successfully",
    statusCode: httpStatus.OK,
    data: result,
  });
});

export const PostControllers = {
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
