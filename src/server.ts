import http from 'http';
import dotenv from 'dotenv';

import { app } from './app';
import { dataSource } from './config/data-source';

dotenv.config();
const PORT = 3500;

const server = http.createServer(app);

async function startServer() {
  try {
    await dataSource.initialize();
    console.log('Connected to DB successfully');

    server.listen(PORT, () => {
      console.log(`Listening on port ${PORT}...`);
    });
  } catch (e) {
    console.log(e);
  }
}

startServer();
