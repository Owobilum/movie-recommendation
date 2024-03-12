import { validate } from 'class-validator';

export async function checkIsInputValid<T>(data: T) {
  const errors = await validate(data as object);
  if (errors.length > 0) {
    throw new Error(
      `Validation failed: ${errors.map((error: any) => error.toString()).join(', ')}`,
    );
  } else {
    return true;
  }
}
