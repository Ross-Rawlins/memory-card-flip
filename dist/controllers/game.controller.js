"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeaderboard = exports.getGameHistory = exports.getGameState = exports.makeMove = exports.startNewGame = void 0;
const game_model_1 = __importDefault(require("../models/game.model"));
const game_utils_1 = require("../utils/game.utils");
const startNewGame = async (res) => {
    try {
        const gameId = (0, game_utils_1.generateUniqueId)();
        const cards = (0, game_utils_1.createInitialGameCards)();
        const newGame = new game_model_1.default({
            gameId,
            cards,
            startTime: new Date(),
            completed: false,
        });
        await newGame.save();
        return res.status(201).json({
            gameId,
            message: 'New game started successfully',
        });
    }
    catch (error) {
        console.error('Error starting new game:', error);
        return res.status(500).json({ error: 'Failed to start new game' });
    }
};
exports.startNewGame = startNewGame;
const makeMove = async (req, res) => {
    try {
        const { gameId } = req.params;
        const { firstCard, secondCard } = req.body;
        if (!(0, game_utils_1.validatePosition)(firstCard) || !(0, game_utils_1.validatePosition)(secondCard)) {
            res.status(400).json({ error: 'Invalid card positions' });
            return;
        }
        if (firstCard.row === secondCard.row &&
            firstCard.column === secondCard.column) {
            res.status(400).json({ error: 'Cannot select the same card twice' });
            return;
        }
        const game = await game_model_1.default.findOne({ gameId });
        if (!game) {
            res.status(404).json({ error: 'Game not found' });
            return;
        }
        if (game.completed) {
            res.status(400).json({ error: 'Game already completed' });
            return;
        }
        const card1 = (0, game_utils_1.getCardByPosition)(game.cards, firstCard);
        const card2 = (0, game_utils_1.getCardByPosition)(game.cards, secondCard);
        if (!card1 || !card2) {
            res.status(400).json({ error: 'One or more cards not found' });
            return;
        }
        if (card1.matched || card2.matched) {
            res.status(400).json({ error: 'One or more cards already matched' });
            return;
        }
        const matched = card1.value === card2.value;
        game.moves.push({
            positions: [firstCard, secondCard],
            matched,
            timestamp: new Date(),
        });
        if (matched) {
            card1.matched = true;
            card2.matched = true;
            const gameComplete = (0, game_utils_1.isGameComplete)(game.cards);
            if (gameComplete) {
                game.completed = true;
                game.endTime = new Date();
            }
        }
        await game.save();
        res.status(200).json({
            matched,
            gameComplete: game.completed,
            movesCount: game.moves.length,
            firstCardValue: card1.value,
            secondCardValue: card2.value,
        });
    }
    catch (error) {
        console.error('Error making move:', error);
        res.status(500).json({ error: 'Failed to process move' });
    }
};
exports.makeMove = makeMove;
const getGameState = async (req, res) => {
    try {
        const { gameId } = req.params;
        const game = await game_model_1.default.findOne({ gameId });
        if (!game) {
            res.status(404).json({ error: 'Game not found' });
            return;
        }
        res.status(200).json({
            gameId: game.gameId,
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
    }
    catch (error) {
        console.error('Error getting game state:', error);
        res.status(500).json({ error: 'Failed to retrieve game state' });
    }
};
exports.getGameState = getGameState;
const getGameHistory = async (req, res) => {
    try {
        const { gameId } = req.params;
        const game = await game_model_1.default.findOne({ gameId });
        if (!game) {
            res.status(404).json({ error: 'Game not found' });
            return;
        }
        res.status(200).json({
            gameId: game.gameId,
            moves: game.moves,
            startTime: game.startTime,
            endTime: game.endTime,
            completed: game.completed,
        });
    }
    catch (error) {
        console.error('Error getting game history:', error);
        res.status(500).json({ error: 'Failed to retrieve game history' });
    }
};
exports.getGameHistory = getGameHistory;
const getLeaderboard = async (res) => {
    try {
        const leaderboard = await game_model_1.default.find({ completed: true })
            .sort({ 'moves.length': 1, endTime: 1 })
            .limit(5)
            .select('gameId moves startTime endTime')
            .exec();
        const formattedLeaderboard = leaderboard.map((game) => {
            const duration = game.endTime
                ? (game.endTime.getTime() - game.startTime.getTime()) / 1000
                : 0;
            return {
                gameId: game.gameId,
                moves: game.moves.length,
                durationSeconds: duration,
                startTime: game.startTime,
                endTime: game.endTime,
            };
        });
        res.status(200).json(formattedLeaderboard);
    }
    catch (error) {
        console.error('Error getting leaderboard:', error);
        res.status(500).json({ error: 'Failed to retrieve leaderboard' });
    }
};
exports.getLeaderboard = getLeaderboard;
//# sourceMappingURL=game.controller.js.map