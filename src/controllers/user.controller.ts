import { Request, Response } from 'express';
import { Inject, Service } from 'typedi';

import { asyncErrorHandler } from '../utils/async-error-handler';
import { UserService } from '../services/user.service';
import { IAuthenticatedRequest } from '../types';

@Service()
export class UserController {
  constructor(@Inject() private readonly userService: UserService) {}

  register = asyncErrorHandler(async (req: Request, res: Response) => {
    const { email, password, username } = req.body;

    const user = await this.userService.registerUser(email, password, username);

    res.status(201).json({
      success: true,
      message: 'New user created!',
      data: user,
    });
  });

  getProfile = asyncErrorHandler(
    async (req: IAuthenticatedRequest, res: Response) => {
      const userId = parseInt(req.params.userId);
      const authenticatedUserId = req.user;

      const profile = await this.userService.getProfile(
        userId,
        authenticatedUserId,
      );

      res.status(200).json({
        success: true,
        data: profile,
      });
    },
  );

  updateWatchlist = asyncErrorHandler(
    async (req: IAuthenticatedRequest, res: Response) => {
      const userId = parseInt(req.params.userId);
      const authenticatedUserId = req.user;
      const { movieId } = req.body;

      const updatedProfile = await this.userService.updateWatchlist(
        userId,
        movieId,
        authenticatedUserId,
      );

      res.status(200).json({
        success: true,
        data: updatedProfile,
      });
    },
  );
}
