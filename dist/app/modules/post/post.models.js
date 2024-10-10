"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const commentSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
}, { timestamps: true });
const postSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    category: {
        type: String,
        enum: [
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
        ],
        required: true,
    },
    tags: {
        type: [String],
    },
    isPremium: {
        type: Boolean,
        default: false,
    },
    upvotes: {
        type: Number,
        default: 0,
    },
    downVotes: {
        type: Number,
        default: 0,
    },
    comments: [commentSchema],
    images: {
        type: [String],
    },
    status: {
        type: String,
        enum: ["Draft", "Published"],
        default: "Draft",
    },
    pdfVersion: {
        type: String,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
postSchema.pre("find", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
postSchema.pre("findOne", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
const Post = (0, mongoose_1.model)("Post", postSchema);
exports.default = Post;
