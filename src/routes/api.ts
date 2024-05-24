import express from 'express';

import { authRouter } from './auth/auth.route';
import { BASE_ROUTES } from '../utils/constants';

const api = express.Router();

api.use(BASE_ROUTES.AUTH, authRouter);

export { api };
