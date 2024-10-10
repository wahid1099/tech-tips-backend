"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenValidationSchema = exports.loginValidationSchema = exports.updateUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
// Create User Schema
const createUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Name is required"),
        email: zod_1.z
            .string()
            .email("Please provide a valid email address")
            .nonempty("Email is required"),
        password: zod_1.z.string().min(6, "Password must be at least 6 characters long"),
        role: zod_1.z.enum(["user", "admin"]).optional(),
        gender: zod_1.z.enum(["male", "female"], {
            required_error: "Gender is required",
        }),
        birthDate: zod_1.z.string().nonempty("Birth date is required"),
        profileImage: zod_1.z.string().optional().nullable(),
        followers: zod_1.z.array(zod_1.z.string()).optional().default([]),
        following: zod_1.z.array(zod_1.z.string()).optional().default([]),
        payments: zod_1.z.array(zod_1.z.string()).optional().default([]),
        bio: zod_1.z.string().optional().nullable(),
        address: zod_1.z.string().optional().nullable(),
    }),
});
exports.createUserSchema = createUserSchema;
const updateUserSchema = createUserSchema.partial().extend({
    isDeleted: zod_1.z.boolean().optional(),
});
exports.updateUserSchema = updateUserSchema;
const loginValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ required_error: "email is required" }),
        password: zod_1.z.string({ required_error: "Password is required" }),
    }),
});
exports.loginValidationSchema = loginValidationSchema;
const refreshTokenValidationSchema = zod_1.z.object({
    cookies: zod_1.z.object({
        refreshToken: zod_1.z.string({
            required_error: "Refresh token is required!",
        }),
    }),
});
exports.refreshTokenValidationSchema = refreshTokenValidationSchema;
