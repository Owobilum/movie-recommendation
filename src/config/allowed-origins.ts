import dotenv from 'dotenv';

dotenv.config();

const origins = process.env.ALLOWED_ORIGINS;
let allowedOrigins: string[];
if (origins) {
  try {
    allowedOrigins = JSON.parse(origins);
  } catch (error) {
    console.error('Error parsing JSON for allowedOrigins:', error);
    allowedOrigins = [];
  }
} else {
  allowedOrigins = [];
}

export { allowedOrigins };
