export enum BASE_ROUTES {
  AUTH = '/auth',
}

export enum AUTH_ROUTES {
  LOGIN = '/login',
  REGISTER = '/register',
}

export const ROUTES = {
  AUTH: AUTH_ROUTES,
} as const;

export const API_PATH = '/api';

export const ACCESS_TOKEN_EXPIRES_IN = '24h';
