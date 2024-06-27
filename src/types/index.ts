import { Request } from 'express';

import { Genre } from '../models/genre.model';
import { Actor } from '../models/actor.model';
import { Movie } from '../models/movie.model';
import { Director } from '../models/director.model';
import { Studio } from '../models/studio.model';

export interface IUserRegisterResponse {
  id: number;
  username: string;
  email: string;
}

export interface IMovie {
  id: number;
  title: string;
  releaseDate: string;
  sourceMaterial: string;
}

export interface IMovieDetail extends IMovie {
  genre: Genre[];
  cast: Actor[];
  studio: string;
  director: string;
  averageRating: number | null;
}

export interface IUser extends IUserRegisterResponse {
  watchlist: Movie[];
  viewingHistory: Movie[];
  preferences: {
    genres: Genre[];
    favoriteCasts: Actor[];
    favoriteDirectors: Director[];
    favoriteStudios: Studio[];
  };
}

export interface IReview {
  id: number;
  userId: number;
  movieId: number;
  rating: number;
  comment: string;
}

export interface IAuthenticatedRequest extends Request {
  user?: string;
}
