import { RequestHandler, Request, Response, NextFunction } from 'express';

import { asyncErrorHandler } from '../../utils/async-error-handler';
import { dataSource } from '../../config/data-source';
import { Movie, MOVIE_RELATIONSHIPS } from '../../models/movie.model';
import { CustomError } from '../../utils/custom-error';
import { IMovieDetail, IMovie } from '../../types';

const handleGetMovie: RequestHandler = asyncErrorHandler(
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const movieId = parseInt(req.params.movieId, 10);

    const movieRepository = dataSource.getRepository(Movie);

    const movie = await movieRepository.findOne({
      where: { id: movieId },
      relations: Object.values(MOVIE_RELATIONSHIPS),
    });

    if (!movie) return next(new CustomError('Movie does not exist', 404));

    const totalRating = movie.reviews.reduce(
      (sum, review) => (sum += review.rating),
      0,
    );
    const averageRating =
      movie.reviews.length === 0 ? null : totalRating / movie.reviews.length;

    const movieObj: IMovieDetail = {
      id: movie.id,
      title: movie.title,
      releaseDate: movie.releaseDate,
      genre: movie.genre,
      cast: movie.cast,
      director: `${movie.director.firstName} ${movie.director.lastName}`,
      sourceMaterial: movie.sourceMaterial,
      studio: movie.studio.name,
      averageRating,
    };

    res.status(200).json({ message: 'Success', data: movieObj });
  },
);

const handleGetMovies: RequestHandler = asyncErrorHandler(
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (_req: Request, res: Response, _next: NextFunction) => {
    const movieRepository = dataSource.getRepository(Movie);
    const movies: IMovie[] = await movieRepository.find();

    res.status(200).json({ message: 'Success', data: movies });
  },
);

export { handleGetMovie, handleGetMovies };
