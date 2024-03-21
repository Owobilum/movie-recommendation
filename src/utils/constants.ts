export enum BASE_ROUTES {
  AUTH = '/auth',
  MOVIES = '/movies',
  USER = '/users',
  RECOMMENDATIONS = '/recommendations',
}

export enum AUTH_ROUTES {
  LOGIN = '/login',
  REGISTER = '/register',
}

export enum MOVIE_ROUTES {
  ALL = '/',
  SINGLE = '/:movieId',
  REVIEWS = '/:movieId/reviews',
}

export enum USER_ROUTES {
  PROFILE = '/:userId/profile',
  WATCHLIST = '/:userId/watchlist',
}

export enum RECOMMENDATIONS_ROUTES {
  ALL = '/',
}

export const ROUTES = {
  AUTH: AUTH_ROUTES,
  MOVIE: MOVIE_ROUTES,
  USER: USER_ROUTES,
  RECOMMENDATIONS: RECOMMENDATIONS_ROUTES,
} as const;

export const API_PATH = '/api';

export const ACCESS_TOKEN_EXPIRES_IN = '24h';
