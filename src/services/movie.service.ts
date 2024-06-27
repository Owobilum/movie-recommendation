import { Service } from 'typedi';
import { Repository } from 'typeorm';

import { dataSource } from '../config/data-source';
import { Movie } from '../models/movie.model';
import { Review } from '../models/review.model';
import { User } from '../models/user.model';
import { MOVIE_RELATIONSHIPS } from '../models/movie.model';
import { CustomError } from '../utils/custom-error';
import { IMovieDetail, IReview } from '../types';

@Service()
export class MovieService {
  movieRepository: Repository<Movie>;
  reviewRepository: Repository<Review>;
  userRepository: Repository<User>;

  constructor() {
    this.movieRepository = dataSource.getRepository(Movie);
    this.reviewRepository = dataSource.getRepository(Review);
    this.userRepository = dataSource.getRepository(User);
  }

  async getAllMovies(): Promise<Movie[]> {
    const movies: Movie[] = await this.movieRepository.find();

    return movies;
  }

  async getReviews(movieId: number): Promise<Review[]> {
    const reviews = await this.reviewRepository
      .createQueryBuilder('review')
      .where('review.movieId = :id', { id: movieId })
      .select(['review.id', 'review.comment', 'review.rating'])
      .leftJoin('review.user', 'user')
      .addSelect('user.id')
      .leftJoin('review.movie', 'movie')
      .addSelect('movie.id')
      .getMany();

    return reviews;
  }

  async getMovieDetails(movieId: number): Promise<IMovieDetail> {
    const movie = await this.movieRepository.findOne({
      where: { id: movieId },
      relations: Object.values(MOVIE_RELATIONSHIPS),
    });

    if (!movie) throw new CustomError('Movie does not exist', 404);

    const totalRating = movie.reviews.reduce(
      (sum, review) => (sum += +review.rating),
      0,
    );
    const averageRating =
      movie.reviews.length === 0 ? null : totalRating / movie.reviews.length;

    const movieDto: IMovieDetail = {
      id: movie.id,
      title: movie.title,
      releaseDate: movie.releaseDate,
      genre: movie.genre,
      cast: movie.cast,
      director: `${movie.director.firstName} ${movie.director.lastName}`,
      sourceMaterial: movie.sourceMaterial,
      studio: movie.studio.name,
      averageRating: averageRating
        ? parseFloat(averageRating.toFixed(1))
        : null,
    };

    return movieDto;
  }

  async createReview(
    comment: string,
    rating: number,
    movieId: number,
    userId?: string,
  ): Promise<IReview> {
    if (!comment || !rating)
      throw new CustomError('comment and rating are required', 400);

    if (!userId)
      throw new CustomError('Not authorised to access this resource', 401);

    const parsedUserId = parseInt(userId);

    const user = await this.userRepository.findOne({
      where: { id: parsedUserId },
    });

    if (!user) throw new CustomError('You cannot access this resource', 403);

    const movie = await this.movieRepository.findOne({
      where: { id: movieId },
    });

    if (!movie) throw new CustomError('Movie does not exist', 404);

    const review = new Review();
    review.comment = comment;
    review.rating = rating;
    review.user = user;
    review.movie = movie;

    const savedReview = await this.reviewRepository.save(review);

    const reviewDto: IReview = {
      id: savedReview.id,
      rating: savedReview.rating,
      comment: savedReview.comment,
      userId: user.id,
      movieId: movie.id,
    };

    return reviewDto;
  }
}
