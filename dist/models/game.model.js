"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const game_types_1 = require("../types/game.types");
const PositionSchema = new mongoose_1.Schema({
    row: { type: Number, enum: [1, 2, 3, 4], required: true },
    column: { type: String, enum: ['A', 'B', 'C', 'D'], required: true },
});
const CardSchema = new mongoose_1.Schema({
    position: { type: PositionSchema, required: true },
    value: {
        type: String,
        enum: Object.values(game_types_1.CardValue),
        required: true,
    },
    matched: { type: Boolean, default: false },
});
const MoveSchema = new mongoose_1.Schema({
    positions: {
        type: [PositionSchema],
        required: true,
        validate: [
            (val) => val.length === 2,
            'Move must contain exactly 2 positions',
        ],
    },
    matched: { type: Boolean, required: true },
    timestamp: { type: Date, default: Date.now },
});
const GameSchema = new mongoose_1.Schema({
    gameId: { type: String, required: true, unique: true },
    cards: { type: [CardSchema], required: true },
    moves: { type: [MoveSchema], default: [] },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date },
    completed: { type: Boolean, default: false },
});
exports.default = mongoose_1.default.model('Game', GameSchema);
//# sourceMappingURL=game.model.js.map