import { NextFunction, Request, Response } from 'express';

import { asyncErrorHandler } from '../../utils/async-error-handler';
import { dataSource } from '../../config/data-source';
import { User } from '../../models/user.model';
import { CustomError } from '../../utils/custom-error';
import { IUser } from '../../types';

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

export { handleGetProfile };
