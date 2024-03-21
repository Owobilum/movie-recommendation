import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { api } from './routes/api';
import { API_PATH } from './utils/constants';
import { handleError } from './middleware/handle-error';
import { credentials } from './middleware/credentials';
import { corsOptions } from './config/cors-options';
import { CustomError } from './utils/custom-error';
import { limiter } from './middleware/limiter';

const app = express();

// Apply Rate Limiting
app.use(limiter);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Handle CORS
app.use(cors(corsOptions));

//middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//API Routes
app.use(API_PATH, api);

// Catch all other routes
app.all('*', (req, _res, next) => {
  const error = new CustomError(
    `The route ${req.originalUrl} does not exist on this server`,
    404,
  );
  next(error);
});

// handle errors that occur inside Express
app.use(handleError);

export { app };
