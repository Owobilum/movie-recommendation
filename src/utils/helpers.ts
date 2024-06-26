import { validate } from 'class-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { ACCESS_TOKEN_EXPIRES_IN } from './constants';

export async function checkIsInputValid<T>(data: T) {
  const errors = await validate(data as object);
  if (errors.length > 0) {
    throw new Error(
      `Validation failed: ${errors.map((error: unknown) => error?.toString()).join(', ')}`,
    );
  } else {
    return true;
  }
}

export const checkIsPasswordValid = (
  submittedPassword: string,
  referencePassword: string,
): Promise<boolean> => bcrypt.compare(submittedPassword, referencePassword);

export function generateJWT(
  payload: string | object | Buffer,
  expirationTime?: string,
): string {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) throw new Error('No token secret in environment');

  return jwt.sign(payload, secret, {
    expiresIn: expirationTime || ACCESS_TOKEN_EXPIRES_IN,
  });
}
