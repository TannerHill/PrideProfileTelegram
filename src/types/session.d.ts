import { Context } from 'telegraf';
import { ShapeTypes } from '../jimpProcessor';

interface PrideProfileSession {
    isCustomInput? : boolean,
    isSplitInput? : boolean,
    currentInput? : number[] | number[][],
    settings? : Settings
}

interface Settings {
    opacity?: number,
    shape?: ShapeTypes
}

export interface SessionContext extends Context {
	session: PrideProfileSession
}