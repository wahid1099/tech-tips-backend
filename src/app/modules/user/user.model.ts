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
    password: { type: String, required: true, select: false }, // Exclude password unless explicitly selected
    role: { type: String, enum: ["user", "admin"], default: "user" },
    gender: { type: String, enum: ["male", "female"], required: true },
    birthDate: { type: Date, required: true },
    isVerified: { type: Boolean, default: false },
    profileImage: { type: String, default: null },
    followers: [{ type: mongoose.Types.ObjectId, ref: "User", default: [] }],
    following: [{ type: mongoose.Types.ObjectId, ref: "User", default: [] }],
    payments: [{ type: mongoose.Types.ObjectId, ref: "Payment", default: [] }],
    status: {
      type: String,
      enum: ["active", "block"],
      default: "active",
    },
    bio: { type: String, default: "", trim: true },
    address: { type: String, default: null },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    virtuals: true,
  }
);

// Hash password before saving the user document
userSchema.pre("save", async function (next) {
  const user = this;

  // Only hash the password if it's new or changed
  if (!user.isModified("password")) {
    return next();
  }

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

// Static method to check if the user exists by email
userSchema.statics.isUserExists = async function (email: string) {
  return await User.findOne({ email }).select("+password");
};

// Static method to check if the password matches
userSchema.statics.isPasswordMatched = async function (
  plainTextPassword: string,
  hashedPassword: string
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

// Check if the JWT was issued before the password change
userSchema.statics.isJwtIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: number,
  jwtIssuedTimestamp: number
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000;
  return passwordChangedTime > jwtIssuedTimestamp;
};

// Remove password from JSON response
userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    return ret;
  },
});

export const User = model<TUser, UserModel>("User", userSchema);
