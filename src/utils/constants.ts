export enum BASE_ROUTES {
  AUTH = '/auth',
  MOVIES = '/movies',
}

export enum AUTH_ROUTES {
  LOGIN = '/login',
  REGISTER = '/register',
}

export enum MOVIE_ROUTES {
  ALL = '/',
  SINGLE = '/:movieId',
}

export const ROUTES = {
  AUTH: AUTH_ROUTES,
  MOVIE: MOVIE_ROUTES,
} as const;

export const API_PATH = '/api';

export const ACCESS_TOKEN_EXPIRES_IN = '24h';
