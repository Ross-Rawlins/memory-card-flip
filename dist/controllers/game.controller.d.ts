import { Request, Response } from 'express';
export declare const startNewGame: (res: Response) => Promise<Response<{
    gameId: string;
    message: string;
} | {
    error: string;
}>>;
export declare const makeMove: (req: Request, res: Response) => Promise<void>;
export declare const getGameState: (req: Request, res: Response) => Promise<void>;
export declare const getGameHistory: (req: Request, res: Response) => Promise<void>;
export declare const getLeaderboard: (res: Response) => Promise<void>;
