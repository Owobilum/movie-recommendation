import express from 'express';
import Container from 'typedi';

import { RECOMMENDATIONS_ROUTES } from '../utils/constants';
import { verifyJWT } from '../middleware/verify-jwt';
import { RecommendationsController } from '../controllers/recommendations.controller';

const recommendationsRouter = express.Router();
const recommendationsController = Container.get(RecommendationsController);

recommendationsRouter.get(
  RECOMMENDATIONS_ROUTES.ALL,
  verifyJWT,
  recommendationsController.getRecommendations,
);

export { recommendationsRouter };
