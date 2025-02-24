"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGameComplete = exports.validatePosition = exports.getCardByPosition = exports.createInitialGameCards = exports.generateUniqueId = void 0;
const game_types_1 = require("../types/game.types");
const generateUniqueId = () => {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 10);
    return `${timestamp}-${randomStr}`;
};
exports.generateUniqueId = generateUniqueId;
const createInitialGameCards = () => {
    const cardValues = Object.values(game_types_1.CardValue);
    const positions = [];
    for (const column of ['A', 'B', 'C', 'D']) {
        for (const row of [1, 2, 3, 4]) {
            positions.push({ row, column });
        }
    }
    shuffleArray(positions);
    const cards = [];
    const pairsNeeded = positions.length / 2;
    if (cardValues.length < pairsNeeded) {
        throw new Error('Not enough unique card values for the game size');
    }
    for (let i = 0; i < pairsNeeded; i++) {
        const value = cardValues[i];
        cards.push({
            position: positions[i * 2],
            value,
            matched: false,
        });
        cards.push({
            position: positions[i * 2 + 1],
            value,
            matched: false,
        });
    }
    return cards;
};
exports.createInitialGameCards = createInitialGameCards;
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};
const getCardByPosition = (cards, position) => {
    return cards.find((card) => card.position.row === position.row &&
        card.position.column === position.column);
};
exports.getCardByPosition = getCardByPosition;
const validatePosition = (position) => {
    const validRows = [1, 2, 3, 4];
    const validColumns = ['A', 'B', 'C', 'D'];
    return (position &&
        validRows.includes(position.row) &&
        validColumns.includes(position.column));
};
exports.validatePosition = validatePosition;
const isGameComplete = (cards) => {
    return cards.every((card) => card.matched);
};
exports.isGameComplete = isGameComplete;
//# sourceMappingURL=game.utils.js.map