// src/controllers/game.controller.ts
import { Request, Response } from 'express';
import Game from '../models/game.model';
import {
  createInitialGameCards,
  getCardByPosition,
  validatePosition,
  isGameComplete,
} from '../utils/game.utils';
import { Position } from '../types/game.types';

export const startNewGame = async (
  _: Request,
  res: Response
): Promise<
  Response<{ gameId: string; message: string } | { error: string }>
> => {
  try {
    const cards = createInitialGameCards();

    const newGame = new Game({
      cards,
      startTime: new Date(),
      completed: false,
    });

    const newGameInstance = await newGame.save();

    return res.status(201).json({
      gameId: newGameInstance._id,
      message: 'New game started successfully',
    });
  } catch (error) {
    console.error('Error starting new game:', error);
    return res.status(500).json({ error: 'Failed to start new game' });
  }
};

export const makeMove = async (
  req: Request,
  res: Response
): Promise<Response | undefined> => {
  try {
    const { gameId } = req.params;
    const { firstCard, secondCard } = req.body;

    if (!validatePosition(firstCard) || !validatePosition(secondCard)) {
      return res.status(400).json({ error: 'Invalid card positions' });
    }

    if (
      firstCard.row === secondCard.row &&
      firstCard.column === secondCard.column
    ) {
      return res
        .status(400)
        .json({ error: 'Cannot select the same card twice' });
    }

    const game = await Game.findById(gameId);

    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    if (game.completed) {
      return res.status(400).json({ error: 'Game already completed' });
    }

    const card1 = getCardByPosition(game.cards, firstCard as Position);
    const card2 = getCardByPosition(game.cards, secondCard as Position);

    if (!card1 || !card2) {
      return res.status(400).json({ error: 'One or more cards not found' });
    }

    if (card1.matched || card2.matched) {
      return res
        .status(400)
        .json({ error: 'One or more cards already matched' });
    }

    const matched = card1.value === card2.value;

    game.moves.push({
      positions: [firstCard, secondCard] as [Position, Position],
      matched,
      timestamp: new Date(),
    });

    if (matched) {
      card1.matched = true;
      card2.matched = true;

      const gameComplete = isGameComplete(game.cards);
      if (gameComplete) {
        game.completed = true;
        game.endTime = new Date();
      }
    }

    await game.save();

    return res.status(200).json({
      matched,
      gameComplete: game.completed,
      movesCount: game.moves.length,
      firstCardValue: card1.value,
      secondCardValue: card2.value,
    });
  } catch (error) {
    console.error('Error making move:', error);
    return res.status(500).json({ error: 'Failed to process move' });
  }
};

export const getGameState = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { gameId } = req.params;
    const game = await Game.findById(gameId);

    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    return res.status(200).json({
      moves: game.moves.length,
      startTime: game.startTime,
      endTime: game.endTime,
      completed: game.completed,
      cards: game.cards.map((card) => ({
        position: card.position,
        matched: card.matched,
        // Only show value if card is matched
        value: card.matched ? card.value : undefined,
      })),
    });
  } catch (error) {
    console.error('Error getting game state:', error);
    return res.status(500).json({ error: 'Failed to retrieve game state' });
  }
};

export const getGameHistory = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { gameId } = req.params;
    const game = await Game.findById(gameId).select(
      'moves startTime endTime completed'
    );

    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    return res.status(200).json({
      moves: game.moves,
      startTime: game.startTime,
      endTime: game.endTime,
      completed: game.completed,
    });
  } catch (error) {
    console.error('Error getting game history:', error);
    return res.status(500).json({ error: 'Failed to retrieve game history' });
  }
};

export const getLeaderboard = async (
  _: Request,
  res: Response
): Promise<Response> => {
  try {
    const leaderboard = await Game.find({ completed: true })
      .sort({ 'moves.length': 1, endTime: 1 })
      .limit(5)
      .select('gameId moves startTime endTime')
      .exec();

    const formattedLeaderboard = leaderboard.map((game) => {
      const duration = game.endTime
        ? (game.endTime.getTime() - game.startTime.getTime()) / 1000
        : 0;

      return {
        moves: game.moves.length,
        durationSeconds: duration,
        startTime: game.startTime,
        endTime: game.endTime,
      };
    });

    if (formattedLeaderboard.length === 0) {
      return res.status(404).json({ error: 'No completed games found' });
    }

    return res.status(200).json(formattedLeaderboard);
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    return res.status(500).json({ error: 'Failed to retrieve leaderboard' });
  }
};
