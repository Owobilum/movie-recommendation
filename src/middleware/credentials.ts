import type { Request, Response, NextFunction } from 'express';

import { allowedOrigins } from '../config/allowed-origins';

const credentials = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  next();
};

export { credentials };
