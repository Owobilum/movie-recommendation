import express from 'express';

import { USER_ROUTES } from '../../utils/constants';
import { handleGetProfile } from '../../controllers/user/user.controller';

const userRouter = express.Router();

userRouter.get(USER_ROUTES.PROFILE, handleGetProfile);

export { userRouter };
