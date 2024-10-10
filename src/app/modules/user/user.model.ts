import mongoose, { model, Schema } from "mongoose";
import { TUser, UserModel } from "./user.interface";
import bcrypt from "bcrypt";
import config from "../../config";

const userSchema = new Schema<TUser, UserModel>(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
        "Please fill a valid email address",
      ],
    },
    passwordChangedAt: {
      type: Date,
    },
    profession: { type: String, default: null },
    userName: { type: String, unique: true },
    password: { type: String, required: true, select: 0 },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    gender: { type: String, enum: ["male", "female"], required: true },
    birthDate: { type: Date, required: true },
    isVerified: { type: Boolean, default: false },
    profileImage: { type: String, default: null },
    followers: [{ type: mongoose.Types.ObjectId, ref: "User", default: [] }],
    following: [{ type: mongoose.Types.ObjectId, ref: "User", default: [] }],
    payments: [{ type: mongoose.Types.ObjectId, ref: "Payment", default: [] }],
    bio: { type: String, default: "", trim: true },
    address: { type: String, default: null },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    virtuals: true,
  }
);

userSchema.pre("save", async function (next) {
  const user = this;
  //if user name is empty
  if (!user.userName && user.email) {
    const emailParts = user.email.split("@");
    user.userName = emailParts[0];
  }
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds)
  );
  next();
});

userSchema.post("save", async function (doc, next) {
  doc.password = "";
  next();
});

userSchema.statics.isUserExists = async function (email: string) {
  return await User.findOne({ email }).select("+password");
};

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

userSchema.statics.isJwtIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: number,
  jwtIssuedTimestamp: number
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000;

  return passwordChangedTime > jwtIssuedTimestamp;
};

userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    return ret;
  },
});

// Static method to check if a user exists by

userSchema.statics.isUserExistByEmail = async function (email) {
  return await this.findOne({ email });
};

//static mathod to check if the password matches

export const User = model<TUser, UserModel>("User", userSchema);
