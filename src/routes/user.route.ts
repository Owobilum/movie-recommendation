import express from 'express';
import Container from 'typedi';

import { USER_ROUTES } from '../utils/constants';
import { UserController } from '../controllers/user.controller';
import { verifyJWT } from '../middleware/verify-jwt';

const userRouter = express.Router();
const userController = Container.get(UserController);

userRouter.get(USER_ROUTES.PROFILE, verifyJWT, userController.getProfile);
userRouter.post(
  USER_ROUTES.WATCHLIST,
  verifyJWT,
  userController.updateWatchlist,
);

export { userRouter };
