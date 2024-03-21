import express from 'express';

import { authRouter } from './auth.route';
import { BASE_ROUTES } from '../utils/constants';
import { movieRouter } from './movie.route';
import { userRouter } from './user.route';

const api = express.Router();

api.use(BASE_ROUTES.AUTH, authRouter);
api.use(BASE_ROUTES.MOVIES, movieRouter);
api.use(BASE_ROUTES.USER, userRouter);

export { api };
