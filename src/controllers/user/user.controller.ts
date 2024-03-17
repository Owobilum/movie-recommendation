import { NextFunction, Request, Response } from 'express';

import { asyncErrorHandler } from '../../utils/async-error-handler';
import { dataSource } from '../../config/data-source';
import { User } from '../../models/user.model';
import { CustomError } from '../../utils/custom-error';
import { IUser } from '../../types';
import { Movie } from '../../models/movie.model';
import { Profile } from '../../models/profile.model';

const handleGetProfile = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = parseInt(req.params.userId);

    const user = await dataSource.getRepository(User).findOne({
      where: { id: userId },
      select: ['id', 'email', 'username'],
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

    if (!user) return next(new CustomError('User not found', 404));

    const userObj: IUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      watchlist: user.profile.watchlist,
      viewingHistory: user.profile.viewingHistory,
      preferences: {
        genres: user.profile.genres,
        favoriteCasts: user.profile.favoriteCasts,
        favoriteDirectors: user.profile.favoriteDirectors,
        favoriteStudios: user.profile.favoriteStudios,
      },
    };

    res.status(200).json({ message: 'success', data: userObj });
  },
);

const handleUpdateWatchlist = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = parseInt(req.params.userId);
    const { movieId } = req.body;

    if (!movieId) return next(new CustomError('No movie selected', 400));

    const userRepository = dataSource.getRepository(User);
    const movieRepository = dataSource.getRepository(Movie);
    const profileRepository = dataSource.getRepository(Profile);

    const user = await userRepository.findOne({
      where: { id: userId },
      relations: ['profile', 'profile.watchlist'],
    });

    if (!user) return next(new CustomError('Cannot find user', 404));

    const profile = await profileRepository.findOne({
      where: { id: user.profile.id },
    });

    if (!profile) return next(new CustomError('Cannot find profile', 404));

    const movie = await movieRepository.findOne({
      where: { id: parseInt(movieId) },
    });

    if (!movie) return next(new CustomError('Movie does not exist', 404));

    profile.watchlist = [...user.profile.watchlist, movie];

    const savedProfile = await profileRepository.save(profile);

    res
      .status(200)
      .json({ message: 'Watchlist updated successfully', data: savedProfile });
  },
);

export { handleGetProfile, handleUpdateWatchlist };
