import express from 'express';
import Container from 'typedi';

import { MovieController } from '../controllers/movie.controller';
import { MOVIE_ROUTES } from '../utils/constants';
import { verifyJWT } from '../middleware/verify-jwt';

const movieRouter = express.Router();

const movieController = Container.get(MovieController);

movieRouter.get(MOVIE_ROUTES.ALL, movieController.getAllMovies);
movieRouter.get(MOVIE_ROUTES.SINGLE, movieController.getMovie);
movieRouter.get(MOVIE_ROUTES.REVIEWS, movieController.getReviews);
movieRouter.post(MOVIE_ROUTES.REVIEWS, verifyJWT, movieController.createReview);

export { movieRouter };
