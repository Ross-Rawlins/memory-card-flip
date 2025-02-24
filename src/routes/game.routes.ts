import { Router } from 'express';
import {
  startNewGame,
  makeMove,
  getGameState,
  getGameHistory,
  getLeaderboard,
} from '../controllers/game.controller';

const router = Router();

router.post('/games', startNewGame);

router.post('/games/:gameId/move', makeMove);

router.get('/games/:gameId', getGameState);

router.get('/games/:gameId/history', getGameHistory);

router.get('/leaderboard', getLeaderboard);

export default router;
