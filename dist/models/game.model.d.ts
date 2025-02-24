import mongoose from 'mongoose';
import { GameState } from '../types/game.types';
declare const _default: mongoose.Model<GameState & mongoose.Document<any, any, any>, {}, {}, {}, mongoose.Document<unknown, {}, GameState & mongoose.Document<any, any, any>> & GameState & mongoose.Document<any, any, any> & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
