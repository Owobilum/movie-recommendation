import { Genre } from '../models/genre.model';
import { Actor } from '../models/actor.model';
export interface IUser {
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
