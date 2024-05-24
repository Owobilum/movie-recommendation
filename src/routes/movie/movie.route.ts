import express from 'express';

import {
  handleGetMovie,
  handleGetMovies,
} from '../../controllers/movie/movie.controller';
import { MOVIE_ROUTES } from '../../utils/constants';

const movieRouter = express.Router();

movieRouter.get(MOVIE_ROUTES.ALL, handleGetMovies);
movieRouter.get(MOVIE_ROUTES.SINGLE, handleGetMovie);

export { movieRouter };
