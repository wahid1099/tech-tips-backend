import { ZodError, ZodIssue } from "zod";
import { TGenericErrorResponse, TErrorSources } from "../interface/error";

const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const errorSource: TErrorSources = err.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue.message,
    };
  });
  const statusCode = 400;
  return {
    statusCode,
    message: "Validation failed",
    errorSource,
  };
};

export default handleZodError;
