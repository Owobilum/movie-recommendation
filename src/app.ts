import express from 'express';

const app = express();

app.use('/', (_req, res) => {
  res.status(200).json({ message: '200', data: { color: 'red' } });
});

export default app;
