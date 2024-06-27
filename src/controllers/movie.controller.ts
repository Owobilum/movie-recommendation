import { Request, Response } from 'express';
import { Inject, Service } from 'typedi';

import { asyncErrorHandler } from '../utils/async-error-handler';
import { IAuthenticatedRequest } from '../types';
import { MovieService } from '../services/movie.service';

@Service()
export class MovieController {
  constructor(@Inject() private readonly movieService: MovieService) {}
  getAllMovies = asyncErrorHandler(async (req: Request, res: Response) => {
    const pageSize = req.query.pageSize
      ? Number(req.query.pageSize)
      : undefined;
    const page = req.query.page ? Number(req.query.page) : undefined;

    const movies = await this.movieService.getAllMovies(page, pageSize);

    res.status(200).json({ success: true, data: movies });
  });

  getReviews = asyncErrorHandler(async (req: Request, res: Response) => {
    const movieId = parseInt(req.params.movieId);
    const reviews = await this.movieService.getReviews(movieId);

    res.status(200).json({ success: true, data: reviews });
  });

  getMovie = asyncErrorHandler(async (req: Request, res: Response) => {
    const movieId = parseInt(req.params.movieId);

    const movie = await this.movieService.getMovieDetails(movieId);

    res.status(200).json({ success: true, data: movie });
  });

  createReview = asyncErrorHandler(
    async (req: IAuthenticatedRequest, res: Response) => {
      const movieId = parseInt(req.params.movieId);
      const userId = req?.user;
      const { comment, rating } = req.body;

      const review = await this.movieService.createReview(
        comment,
        rating,
        movieId,
        userId,
      );

      res.status(201).json({ success: true, data: review });
    },
  );
}
