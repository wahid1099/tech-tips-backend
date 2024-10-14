"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostValidation = void 0;
const zod_1 = require("zod");
const commentValidationSchema = zod_1.z.object({
    user: zod_1.z.string().nonempty("User ID is required"),
    content: zod_1.z.string().min(1, "Content is required"),
    isDeleted: zod_1.z.boolean().default(false),
});
const createPostValidation = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, "Title is required").trim(),
        description: zod_1.z.string().min(1, "Description is required"),
        author: zod_1.z.string().nonempty("Author ID is required"),
        category: zod_1.z.enum([
            "Web",
            "Android",
            "Software Engineering",
            "VR",
            "Mobile",
            "Macbook",
            "Gaming",
            "Artificial Intelligence",
            "Blockchain",
            "Cybersecurity",
            "Data Science",
            "Machine Learning",
            "Natural Language Processing",
            "Cloud Computing",
            "Quantum Computing",
            "Quantum Cryptography",
            "Artificial General Intelligence",
            "Others",
        ]),
        tags: zod_1.z.array(zod_1.z.string()).optional(),
        isPremium: zod_1.z.boolean().default(false),
        thumbnailImage: zod_1.z.string().url("Invalid thumbnail URL").optional(),
        upVotes: zod_1.z.number().int().nonnegative().default(0),
        downVotes: zod_1.z.number().int().nonnegative().default(0),
        comments: zod_1.z.array(commentValidationSchema).optional(),
        status: zod_1.z.enum(["Draft", "Published"]).default("Draft"),
        pdfVersion: zod_1.z.string().url("Invalid PDF URL").optional(),
        isDeleted: zod_1.z.boolean().default(false),
    }),
});
const updatePostValidation = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, "Title is required").trim().optional(),
        description: zod_1.z.string().min(1, "description is required").optional(),
        category: zod_1.z
            .enum([
            "Web",
            "Android",
            "Software Engineering",
            "VR",
            "Mobile",
            "Macbook",
            "Gaming",
            "Artificial Intelligence",
            "Blockchain",
            "Cybersecurity",
            "Data Science",
            "Machine Learning",
            "Natural Language Processing",
            "Cloud Computing",
            "Quantum Computing",
            "Quantum Cryptography",
            "Artificial General Intelligence",
            "Others",
        ])
            .optional(),
        tags: zod_1.z.array(zod_1.z.string()).optional(),
        isPremium: zod_1.z.boolean().default(false).optional(),
        thumbnailImage: zod_1.z.string().url("Invalid thumbnail URL").optional(),
    }),
});
exports.PostValidation = {
    createPostValidation,
    updatePostValidation,
};
