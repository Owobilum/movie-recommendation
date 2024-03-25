import express from 'express';

import {
  handleCreateReview,
  handleGetMovie,
  handleGetMovies,
  handleGetReviews,
} from '../controllers/movie/movie.controller';
import { MOVIE_ROUTES } from '../utils/constants';
import { verifyJWT } from '../middleware/verify-jwt';

const movieRouter = express.Router();

movieRouter.get(MOVIE_ROUTES.ALL, handleGetMovies);
movieRouter.get(MOVIE_ROUTES.SINGLE, handleGetMovie);
movieRouter.get(MOVIE_ROUTES.REVIEWS, handleGetReviews);
movieRouter.post(MOVIE_ROUTES.REVIEWS, verifyJWT, handleCreateReview);

export { movieRouter };
