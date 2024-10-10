import httpStatus from "http-status";
import AppError from "../../error/AppError";
import { TUser } from "./user.interface";
import { User } from "./user.model";

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
export const UserServices = {
  createUserIntoDB,
  getSingleUserIntoDB,
  getAllUsersIntoDB,
  updateUserIntoDB,
  deleteUserIntoDB,
  getuserFromDB,
};
