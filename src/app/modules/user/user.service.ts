import httpStatus from "http-status";
import AppError from "../../error/AppError";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import mongoose from "mongoose";

const createUserIntoDB = async (payload: TUser) => {
  const result = await User.create(payload);
  return result;
};

const getSingleUserIntoDB = async (id: string) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  return user;
};

const getAllUsersIntoDB = async () => {
  const users = await User.find();
  return users;
};

const updateUserIntoDB = async (id: string, payload: Partial<TUser>) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  const updatedUser = await User.findOneAndUpdate({ _id: id }, payload, {
    runValidators: true,
    new: true,
  });
  return updatedUser;
};

const deleteUserIntoDB = async (id: string) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  const deletedUser = await User.findOneAndUpdate(
    { _id: id },
    { isDeleted: true },
    { new: true }
  );
  return deletedUser;
};

const getuserFromDB = async (email: string) => {
  const user = await User.isUserExists(email);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }
  if (user?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "User is deleted!");
  }

  return user;
};
const toggleFollowUserIntoDB = async (
  followingId: string,
  followerId: string
) => {
  const followingUser = await User.findById(followingId);
  const followerUser = await User.findById(followerId); // Fetch the follower user by ID

  if (!followingUser || !followerUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  if (followingUser?.isDeleted || followerUser?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "User is deleted");
  }

  // Check if the follower is already following
  // Example of converting if needed
  const isFollowing = followingUser.followers.includes(
    new mongoose.Types.ObjectId(followerUser._id)
  );

  if (isFollowing) {
    // Unfollow the user
    await User.findByIdAndUpdate(
      followingUser._id,
      { $pull: { following: followerUser._id } }, // Corrected to pull from following
      { new: true }
    );
    await User.findByIdAndUpdate(
      followerUser._id, // Pull from the follower
      { $pull: { followers: followingUser._id } },
      { new: true }
    );
    return null;
  } else {
    // Follow the user
    await User.findByIdAndUpdate(
      followerUser._id,
      { $addToSet: { following: followingUser._id } },
      { new: true }
    );
    await User.findByIdAndUpdate(
      followingUser._id,
      { $addToSet: { followers: followerUser._id } },
      { new: true }
    );
    return null;
  }
};

const userManageStatus = async (id: string, action: "block" | "unblock") => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  if (action === "block") {
    if (user?.isDeleted) {
      throw new AppError(httpStatus.BAD_REQUEST, "User is deleted");
    }
    if (user?.status === "block") {
      throw new AppError(httpStatus.BAD_REQUEST, "User is blocked");
    }
    const result = await User.findByIdAndUpdate(
      user._id,
      { status: "block" },
      { new: true, runValidators: true }
    );

    return result;
  } else if (action === "unblock") {
    if (user?.status !== "block") {
      throw new AppError(httpStatus.BAD_REQUEST, "User is already active");
    }
    const result = await User.findByIdAndUpdate(
      user._id,
      { status: "active" },
      { new: true, runValidators: true }
    );

    return result;
  }
};

const getUserFollowersAndFollowing = async (id: string) => {
  const user = await User.findById(id)
    .populate("followers")
    .populate("following");
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  return {
    followers: user.followers,
    following: user.following,
  };
};

export const UserServices = {
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
