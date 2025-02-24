"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const game_controller_1 = require("../controllers/game.controller");
const router = (0, express_1.Router)();
router.post('/games', game_controller_1.startNewGame);
router.post('/games/:gameId/move', game_controller_1.makeMove);
router.get('/games/:gameId', game_controller_1.getGameState);
router.get('/games/:gameId/history', game_controller_1.getGameHistory);
router.get('/leaderboard', game_controller_1.getLeaderboard);
exports.default = router;
//# sourceMappingURL=game.routes.js.map