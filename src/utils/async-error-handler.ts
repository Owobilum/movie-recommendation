import { NextFunction, Request, Response } from 'express';

function asyncErrorHandler(
  func: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    func(req, res, next).catch((err) => next(err));
  };
}

export { asyncErrorHandler };
