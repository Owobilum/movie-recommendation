import express from 'express';
import { RECOMMENDATIONS_ROUTES } from '../utils/constants';
import { handleGetRecommendations } from '../controllers/recommendations/recommendations.controller';
import { verifyJWT } from '../middleware/verify-jwt';

const recommendationsRouter = express.Router();

recommendationsRouter.get(
  RECOMMENDATIONS_ROUTES.ALL,
  verifyJWT,
  handleGetRecommendations,
);

export { recommendationsRouter };
