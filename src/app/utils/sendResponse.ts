import { Response } from "express";

export type TPagination = {
  totalPosts: number;
  totalPages: number;
  currentPage: number;
  hasMore: boolean;
};

export type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  data: T;
  token?: string;
  pagination?: TPagination; // Add pagination field
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    statuscode: data.statusCode,
    message: data.message,
    data: data.data,
    token: data.token,
    pagination: data.pagination, // Include pagination if available
  });
};

export default sendResponse;
