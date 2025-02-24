import { Card, CardValue, Position } from '../types/game.types';

export const createInitialGameCards = (): Card[] => {
  const cardValues = Object.values(CardValue);
  const positions: Position[] = [];

  for (const column of ['A', 'B', 'C', 'D'] as const) {
    for (const row of [1, 2, 3, 4] as const) {
      positions.push({ row, column });
    }
  }

  shuffleArray(positions);

  const cards: Card[] = [];
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

const shuffleArray = <T>(array: T[]): void => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

export const getCardByPosition = (
  cards: Card[],
  position: Position
): Card | undefined => {
  return cards.find(
    (card) =>
      card.position.row === position.row &&
      card.position.column === position.column
  );
};

export const validatePosition = (position: any): boolean => {
  const validRows = [1, 2, 3, 4];
  const validColumns = ['A', 'B', 'C', 'D'];

  return (
    position &&
    validRows.includes(position.row) &&
    validColumns.includes(position.column)
  );
};

export const isGameComplete = (cards: Card[]): boolean => {
  return cards.every((card) => card.matched);
};
