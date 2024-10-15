"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
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
    upVotes: [
        {
            type: mongoose_1.default.Types.ObjectId,
            ref: "User",
            default: [],
        },
    ],
    downVotes: [
        {
            type: mongoose_1.default.Types.ObjectId,
            ref: "User",
            default: [],
        },
    ],
    comments: [commentSchema],
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
    thumbnailImage: {
        type: String,
        required: false,
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
