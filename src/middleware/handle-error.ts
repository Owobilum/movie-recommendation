import { NextFunction, Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

import { CustomError } from '../utils/custom-error';

enum NODE_ENVIRONMENTS {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
}

const devErrors = (res: Response, error: CustomError) => {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    stackTrace: error.stack,
    error,
  });
};

const prodErrors = (res: Response, error: CustomError) => {
  //   Any errors which we throw ourselves, using the CustomError class will have isOperational set to true. But errors which
  //   a 3rd party library throws, maybe for a failed model validation, will not have isOperational. We don't want to send those errors
  //   to the client in prod. But here we customize the error so we don't give too much info, but the user still finds it meaningful.

  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong! Please try again later.',
    });
  }
};

enum FailedQueryErrorCodes {
  UniqueViolation = '23505',
  NotNullViolation = '23502',
  CheckViolation = '23514',
}

const failedQueryErrorHandler = (error: any) => {
  let msg = '';
  const code = error.code;
  switch (code) {
    case FailedQueryErrorCodes.UniqueViolation:
      msg = 'Provided input already exists';
      break;
    case FailedQueryErrorCodes.NotNullViolation:
      msg = `Missing required data`;
      break;
    case FailedQueryErrorCodes.CheckViolation:
      msg = 'Provided data is not valid';
      break;
    default:
      msg = 'Something went wrong! Please check your inputs';
      break;
  }

  return new CustomError(
    msg,
    code === FailedQueryErrorCodes.UniqueViolation ? 409 : 400,
  );
};

const handleError = (
  error: any,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  if (process.env.NODE_ENV === NODE_ENVIRONMENTS.DEVELOPMENT) {
    return devErrors(res, error);
  }

  if (error instanceof QueryFailedError) {
    error = failedQueryErrorHandler(error);
  }

  prodErrors(res, error);
};

export { handleError };
