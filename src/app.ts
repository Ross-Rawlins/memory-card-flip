import express from 'express';
import cors from 'cors';
import gameRoutes from './routes/game.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', gameRoutes);

app.get('/health', (_, res) => {
  return res.status(200).json({ status: 'ok' });
});

export default app;
