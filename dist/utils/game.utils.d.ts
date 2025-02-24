import { Card, Position } from '../types/game.types';
export declare const generateUniqueId: () => string;
export declare const createInitialGameCards: () => Card[];
export declare const getCardByPosition: (cards: Card[], position: Position) => Card | undefined;
export declare const validatePosition: (position: any) => boolean;
export declare const isGameComplete: (cards: Card[]) => boolean;
