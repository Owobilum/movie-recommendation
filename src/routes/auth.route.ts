import express from 'express';
import Container from 'typedi';

import { AUTH_ROUTES } from '../utils/constants';
import { UserController } from '../controllers/user.controller';
import { AuthController } from '../controllers/auth.controller';

const authRouter = express.Router();
const userController = Container.get(UserController);
const authController = Container.get(AuthController);

authRouter.post(AUTH_ROUTES.REGISTER, userController.register);
authRouter.post(AUTH_ROUTES.LOGIN, authController.login);

export { authRouter };
