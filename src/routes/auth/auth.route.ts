import express from 'express';

import { AUTH_ROUTES } from '../../utils/constants';
import { handleRegisterUser } from '../../controllers/auth/register.controller';
import { handleLogin } from '../../controllers/auth/login.controller';

const authRouter = express.Router();

authRouter.post(AUTH_ROUTES.REGISTER, handleRegisterUser);
authRouter.post(AUTH_ROUTES.LOGIN, handleLogin);

export { authRouter };
