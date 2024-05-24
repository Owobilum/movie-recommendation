import express from 'express';

import { authRouter } from './auth/auth.route';
import { BASE_ROUTES } from '../utils/constants';
import { movieRouter } from './movie/movie.route';

const api = express.Router();

api.use(BASE_ROUTES.AUTH, authRouter);
api.use(BASE_ROUTES.MOVIES, movieRouter);

export { api };
