import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { CustomError } from '../utils/custom-error';

const verifyJWT = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader)
    return next(
      new CustomError('You are not authorised to access this resource', 401),
    );
  const token = authHeader.split(' ')[1]; // Bearer token
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as jwt.Secret,
    (err, decoded) => {
      if (err)
        return next(
          new CustomError(
            'You are not authorised to access this resource',
            403,
          ),
        ); //invalid token
      if (decoded && typeof decoded !== 'string') {
        (req as any).user = decoded.user;
      }
      next();
    },
  );
};

export { verifyJWT };
