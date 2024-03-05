import http from 'http';

import app from './app';

const PORT = 3500;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
