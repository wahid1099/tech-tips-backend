import { TGenericErrorResponse } from "../interface/error";
import mongoose from "mongoose";

const handleCastError = (
  err: mongoose.Error.CastError
): TGenericErrorResponse => {
  const errorSource = [
    {
      path: err.path,
      message: err.message,
    },
  ];

  const statusCode = 400;
  return {
    statusCode,
    message: "Invalid Id",
    errorSource,
  };
};

export default handleCastError;
