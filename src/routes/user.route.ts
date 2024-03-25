import express from 'express';

import { USER_ROUTES } from '../utils/constants';
import {
  handleGetProfile,
  handleUpdateWatchlist,
} from '../controllers/user/user.controller';
import { verifyJWT } from '../middleware/verify-jwt';

const userRouter = express.Router();

userRouter.get(USER_ROUTES.PROFILE, verifyJWT, handleGetProfile);
userRouter.post(USER_ROUTES.WATCHLIST, verifyJWT, handleUpdateWatchlist);

export { userRouter };
