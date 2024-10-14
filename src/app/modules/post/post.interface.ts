import { Types } from "mongoose";

export interface TComment {
  user: Types.ObjectId;
  content: string;
}

export interface TPost {
  _id: Types.ObjectId;
  title: string;
  description: string;
  author: Types.ObjectId;
  category:
    | "Web"
    | "Android"
    | "Software Engineering"
    | "VR"
    | "Mobile"
    | "Macbook"
    | "Gaming"
    | "Artificial Intelligence"
    | "Blockchain"
    | "Cybersecurity"
    | "Data Science"
    | "Machine Learning"
    | "Natural Language Processing"
    | "Cloud Computing"
    | "Quantum Computing"
    | "Quantum Cryptography"
    | "Artificial General Intelligence"
    | "Others";
  tags?: string[];
  isPremium: boolean;
  upVotes: Types.ObjectId[];

  downVotes: Types.ObjectId[];

  comments: TComment[];
  images?: string[];
  status: "Draft" | "Published";
  pdfVersion?: string;
  isDeleted: boolean;
}
