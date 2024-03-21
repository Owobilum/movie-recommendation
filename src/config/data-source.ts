import { DataSource } from 'typeorm';

import { User } from '../models/user.model';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATASOURCE_HOST,
  port: process.env.DATASOURCE_PORT
    ? Number(process.env.DATASOURCE_PORT)
    : undefined,
  username: process.env.DATASOURCE_USERNAME,
  password: process.env.DATASOURCE_PASSWORD,
  database: process.env.DATASOURCE_DATABASE,
  entities: [User],
  synchronize: true,
});

export { dataSource };
