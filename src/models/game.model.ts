import mongoose, { Schema, Document } from 'mongoose';
import {
  GameState,
  CardValue,
  Position,
  Card,
  Move,
} from '../types/game.types';

const PositionSchema = new Schema<Position>({
  row: { type: Number, enum: [1, 2, 3, 4], required: true },
  column: { type: String, enum: ['A', 'B', 'C', 'D'], required: true },
});

const CardSchema = new Schema<Card>({
  position: { type: PositionSchema, required: true },
  value: {
    type: String,
    enum: Object.values(CardValue),
    required: true,
  },
  matched: { type: Boolean, default: false },
});

const MoveSchema = new Schema<Move>({
  positions: {
    type: [PositionSchema],
    required: true,
    validate: [
      (val: Position[]) => val.length === 2,
      'Move must contain exactly 2 positions',
    ],
  },
  matched: { type: Boolean, required: true },
  timestamp: { type: Date, default: Date.now },
});

const GameSchema = new Schema<GameState & Document>({
  cards: { type: [CardSchema], required: true },
  moves: { type: [MoveSchema], default: [] },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  completed: { type: Boolean, default: false },
});

export default mongoose.model<GameState & Document>('Game', GameSchema);
