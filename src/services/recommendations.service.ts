import { Service } from 'typedi';
import { Repository } from 'typeorm';

import { dataSource } from '../config/data-source';
import { CustomError } from '../utils/custom-error';
import { User } from '../models/user.model';
import { Movie } from '../models/movie.model';

@Service()
export class RecommendationsService {
  movieRepository: Repository<Movie>;
  userRepository: Repository<User>;

  constructor() {
    this.movieRepository = dataSource.getRepository(Movie);
    this.userRepository = dataSource.getRepository(User);
  }

  async getRecommendations(userId?: string): Promise<Movie[]> {
    if (!userId) throw new CustomError('You are not authorised', 401);

    const user = await this.userRepository.findOne({
      where: { id: +userId },
      select: ['id'],
      relations: [
        'profile',
        'profile.watchlist',
        'profile.viewingHistory',
        'profile.favoriteCasts',
        'profile.favoriteDirectors',
        'profile.favoriteStudios',
        'profile.genres',
      ],
    });

    const allMovies = await this.movieRepository.find({
      relations: ['cast', 'director', 'studio', 'genre'],
    });

    if (!user) throw new CustomError('You cannot access this resource', 403);

    const favoriteActors = user.profile.favoriteCasts;
    const favoriteDirectors = user.profile.favoriteDirectors;
    const favoriteGenres = user.profile.genres;

    const favoriteActorIds = favoriteActors.map((actor) => actor.id);
    const favoriteDirectorsIds = favoriteDirectors.map(
      (director) => director.id,
    );
    const favoriteGenresIds = favoriteGenres.map((genre) => genre.id);

    const moviesFeaturingFavorites = allMovies.filter(
      (movie) =>
        movie.cast.some((actor) => favoriteActorIds.includes(actor.id)) ||
        favoriteDirectorsIds.some(
          (favoriteDirectorId) => favoriteDirectorId === movie.director.id,
        ) ||
        movie.genre.some((genre) => favoriteGenresIds.includes(genre.id)),
    );

    const unsortedRecommendations = [
      ...moviesFeaturingFavorites,
      ...user.profile.watchlist,
      ...user.profile.viewingHistory,
    ];

    // Count the frequency of each movie's ID
    const idFrequency: Record<number, number> = {};
    unsortedRecommendations.forEach((movie) => {
      const id = movie.id;
      idFrequency[id] = (idFrequency[id] || 0) + 1;
    });

    //Sort the array based on the frequency of IDs in descending order
    unsortedRecommendations.sort((a, b) => {
      const frequencyA = idFrequency[a.id];
      const frequencyB = idFrequency[b.id];
      if (frequencyA !== frequencyB) {
        return frequencyB - frequencyA; // Sort by frequency in descending order
      } else {
        return a.id - b.id; // If frequencies are the same, sort by ID in ascending order
      }
    });

    // Remove duplicates, keeping only the first occurrence of each unique ID
    const uniqueIds = new Set<number>();
    const uniqueMovies: Movie[] = [];
    unsortedRecommendations.forEach((movie) => {
      if (!uniqueIds.has(movie.id)) {
        uniqueMovies.push(movie);
        uniqueIds.add(movie.id);
      }
    });

    return uniqueMovies;
  }
}
