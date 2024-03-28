import { DataSource } from 'typeorm';

import { User } from '../models/user.model';
import { Movie } from '../models/movie.model';
import { Director } from '../models/director.model';
import { Actor } from '../models/actor.model';
import { Genre } from '../models/genre.model';
import { Review } from '../models/review.model';
import { Studio } from '../models/studio.model';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATASOURCE_HOST,
  port: process.env.DATASOURCE_PORT
    ? Number(process.env.DATASOURCE_PORT)
    : undefined,
  username: process.env.DATASOURCE_USERNAME,
  password: process.env.DATASOURCE_PASSWORD,
  database: process.env.DATASOURCE_DATABASE,
  entities: [User, Movie, Director, Actor, Genre, Review, Studio],
  synchronize: true,
});

export { dataSource };
