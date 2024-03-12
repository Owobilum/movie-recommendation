import express from 'express';

import { AUTH_ROUTES } from '../../utils/constants';
import { handleRegisterUser } from '../../controllers/auth/register.controller';

const authRouter = express.Router();

authRouter.post(AUTH_ROUTES.REGISTER, handleRegisterUser);

export { authRouter };
