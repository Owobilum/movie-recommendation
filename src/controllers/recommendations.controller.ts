import { Response } from 'express';
import { Inject, Service } from 'typedi';

import { asyncErrorHandler } from '../utils/async-error-handler';
import { RecommendationsService } from '../services/recommendations.service';
import { IAuthenticatedRequest } from '../types';

@Service()
export class RecommendationsController {
  constructor(
    @Inject() private readonly recommendationsService: RecommendationsService,
  ) {}

  getRecommendations = asyncErrorHandler(
    async (req: IAuthenticatedRequest, res: Response) => {
      const userId = req.user;

      const recommendations =
        this.recommendationsService.getRecommendations(userId);

      res.status(200).json({
        success: true,
        data: recommendations,
      });
    },
  );
}
