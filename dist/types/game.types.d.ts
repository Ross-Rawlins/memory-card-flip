export declare enum CardValue {
    CAT = "CAT",
    COW = "COW",
    FISH = "FISH",
    PIG = "PIG",
    DOG = "DOG",
    BIRD = "BIRD",
    SHEEP = "SHEEP",
    HORSE = "HORSE"
}
export type Position = {
    row: 1 | 2 | 3 | 4;
    column: 'A' | 'B' | 'C' | 'D';
};
export type Card = {
    position: Position;
    value: CardValue;
    matched: boolean;
};
export type Move = {
    positions: [Position, Position];
    matched: boolean;
    timestamp: Date;
};
export type GameState = {
    gameId: string;
    cards: Card[];
    moves: Move[];
    startTime: Date;
    endTime?: Date;
    completed: boolean;
};
