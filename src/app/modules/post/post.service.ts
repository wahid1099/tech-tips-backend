import httpStatus from "http-status";
import AppError from "../../error/AppError";
import { TComment, TPost } from "./post.interface";
import Post from "./post.models";
import { User } from "../user/user.model";
import { Types } from "mongoose";

interface QueryParams {
  title?: { $regex: string; $options: string };
  category?: string;
}

const getAllPostsFromDB = async (
  searchQuery = "",
  category = "",
  page = 1,
  limit = 10
) => {
  // Ensure page and limit are valid numbers
  const pageNumber = Math.max(1, Number(page) || 1); // Default to 1 if NaN
  const limitNumber = Math.max(1, Number(limit) || 10); // Default to 10 if NaN
  const skip = (pageNumber - 1) * limitNumber;

  const query: QueryParams = {}; // Use the interface

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
    const posts = await Post.find(query)
      .populate("author")
      .populate("comments.user")
      .sort("-createdAt")
      .skip(skip)
      .limit(limitNumber);

    const totalPosts = await Post.countDocuments(query); // Total number of posts

    return {
      posts,
      totalPosts,
      totalPages: Math.ceil(totalPosts / limitNumber),
      currentPage: pageNumber,
      hasMore: pageNumber * limitNumber < totalPosts, // Check if there are more posts
    };
  } catch (error) {
    console.error("Error fetching posts:", error); // Log any errors
    throw new Error("Could not fetch posts"); // Handle errors appropriately
  }
};

const getSinglePostFromDB = async (postId: string) => {
  const post = await Post.findById(postId)
    .populate("author")
    .populate("comments.user");
  if (!post) {
    throw new Error("Post not found");
  }
  if (post.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "Post already deleted");
  }
  return post;
};

const createPostIntoDB = async (payload: TPost) => {
  const post = (await (await Post.create(payload)).populate("author")).populate(
    "comments.user"
  );
  return post;
};

const updatePostIntoDB = async (postId: string, payload: Partial<TPost>) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError(httpStatus.BAD_REQUEST, "Post not found");
  }
  if (post.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "Post already deleted");
  }
  const updatedPost = await Post.findByIdAndUpdate(postId, payload, {
    new: true,
    runValidators: true,
  });
  return updatedPost;
};

const deletePostIntoDB = async (postId: string) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError(httpStatus.BAD_REQUEST, "Post not found");
  }
  if (post.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "Post already deleted");
  }
  const deletedPost = await Post.findByIdAndUpdate(
    postId,
    { isDeleted: true },
    { new: true, runValidators: true }
  );
  return deletedPost;
};
const commentIntoDB = async (postId: string, payload: TComment) => {
  const post = await Post.findById(postId);

  if (!post) {
    throw new AppError(httpStatus.BAD_REQUEST, "Post not found");
  }
  if (post.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "Post already deleted");
  }
  const result = await Post.findByIdAndUpdate(
    postId,
    {
      $addToSet: { comments: payload },
    },
    { new: true, runValidators: true }
  );
  return result;
};
const commentDeleteIntoDB = async (postId: string, commentId: string) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError(httpStatus.BAD_REQUEST, "Post not found");
  }
  if (post.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "Post already deleted");
  }
  const commentExists = post.comments.some(
    (comment) => comment._id?.toString() === commentId
  );
  if (!commentExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Comments are not found");
  }
  const updatePost = await Post.findByIdAndUpdate(
    postId,
    {
      $pull: { comments: { _id: commentId } },
    },
    { new: true, runValidators: true }
  );
  return updatePost;
};
const commentsUpdateIntoDB = async (
  postId: string,
  commentId: string,
  newCommment: Record<string, unknown>
) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError(httpStatus.BAD_REQUEST, "Post not found");
  }
  if (post.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "Post already deleted");
  }
  const commentIndex = post.comments.findIndex(
    (comment) => comment._id?.toString() === commentId
  );
  if (commentIndex === -1) {
    throw new AppError(httpStatus.NOT_FOUND, "Comment not found");
  }
  post.comments[commentIndex].content = newCommment.content as string;
  const updatedPost = await post.save();
  return updatedPost;
};
const votePostIntoDB = async (
  userId: string,
  postId: string,
  action: "upvote" | "downvote"
) => {
  const post = await Post.findById(postId);

  if (!post) {
    throw new AppError(httpStatus.BAD_REQUEST, "Post not found");
  }

  if (post.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "Post already deleted");
  }

  const upVotesArray = Array.isArray(post.upVotes) ? post.upVotes : [];
  const downVotesArray = Array.isArray(post.downVotes) ? post.downVotes : [];

  // Remove user from both upVotes and downVotes arrays before adding new vote
  post.upVotes = upVotesArray.filter((id) => id.toString() !== userId) as any;
  post.downVotes = downVotesArray.filter(
    (id) => id.toString() !== userId
  ) as any;

  // Apply the appropriate action
  if (action === "upvote") {
    post.upVotes.push(new Types.ObjectId(userId));
  } else if (action === "downvote") {
    post.downVotes.push(new Types.ObjectId(userId));
  }

  const updatedPost = await post.save();
  return updatedPost;
};

const myPostsIntoDB = async (email: string) => {
  const user = await User.isUserExists(email);
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "User not found");
  }
  if (user.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already deleted");
  }
  const userId = user?._id.toString();
  const result = await Post.find({ author: userId, isDeleted: false })
    .populate("author")
    .populate("comments.user")
    .sort("-createdAt");
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, "Posts not found");
  }
  return result;
};
export const PostServices = {
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
