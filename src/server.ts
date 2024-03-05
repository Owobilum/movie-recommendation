import http from 'http';

const PORT = 3500;

const server = http.createServer((_req, res) => {
  res.writeHead(200, 'success', { 'Content-Type': 'text/plain' });
  res.end('Hello');
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
