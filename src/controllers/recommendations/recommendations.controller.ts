import { Request, RequestHandler, Response } from 'express';

import { CustomError } from '../../utils/custom-error';
import { asyncErrorHandler } from '../../utils/async-error-handler';
import { dataSource } from '../../config/data-source';
import { User } from '../../models/user.model';
import { Movie } from '../../models/movie.model';

const handleGetRecommendations: RequestHandler = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const userId = (req as any).user;
    if (!userId) return new CustomError('You are not authorised', 401);

    const user = await dataSource.getRepository(User).findOne({
      where: { id: userId },
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

    const allMovies = await dataSource.getRepository(Movie).find({
      relations: ['cast', 'director', 'studio', 'genre'],
    });

    if (!user) return new CustomError('You cannot access this resource', 403);

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

    res.status(200).json({
      message: 'success',
      movies: uniqueMovies,
    });
  },
);

export { handleGetRecommendations };
