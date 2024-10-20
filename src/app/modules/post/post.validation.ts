import { z } from "zod";

const commentValidationSchema = z.object({
  user: z.string().nonempty("User ID is required"),
  content: z.string().min(1, "Content is required"),
  isDeleted: z.boolean().default(false),
});

const createPostValidation = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required").trim(),
    description: z.string().min(1, "Description is required"),
    author: z.string().nonempty("Author ID is required"),
    category: z.enum([
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
    tags: z.array(z.string()).optional(),
    isPremium: z.boolean().default(false),
    thumbnailImage: z
      .string()
      .refine(
        (value) => value === "" || z.string().url().safeParse(value).success,
        {
          message: "Invalid thumbnail URL",
        }
      )
      .optional()
      .nullable(),

    upVotes: z.number().int().nonnegative().default(0),
    downVotes: z.number().int().nonnegative().default(0),
    comments: z.array(commentValidationSchema).optional(),

    status: z.enum(["Draft", "Published"]).default("Draft"),
    pdfVersion: z.string().url("Invalid PDF URL").optional(),
    isDeleted: z.boolean().default(false),
  }),
});

const updatePostValidation = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required").trim().optional(),
    description: z.string().min(1, "description is required").optional(),
    category: z
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
    tags: z.array(z.string()).optional(),
    isPremium: z.boolean().default(false).optional(),
    thumbnailImage: z
      .string()
      .refine(
        (value) => value === "" || z.string().url().safeParse(value).success,
        {
          message: "Invalid thumbnail URL",
        }
      )
      .optional()
      .nullable(),
  }),
});

export const PostValidation = {
  createPostValidation,
  updatePostValidation,
};
