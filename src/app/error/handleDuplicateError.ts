import { TGenericErrorResponse, TErrorSources } from "../interface/error";

const handleDuplicateError = (err: any): TGenericErrorResponse => {
  const match = err.message.match(/"([^"]+)"/);
  const extractMessage = match && match[1];
  const errorSource: TErrorSources = [
    {
      path: "",
      message: `${extractMessage} is already exsists`,
    },
  ];

  const statusCode = 400;

  return {
    statusCode,
    message: "Duplicate Error",
    errorSource,
  };
};

export default handleDuplicateError;
