import Event from "./event.js";
import Pitch from "./pitch.js";
import Parts from "./parts.js";

namespace Util {
    export type Bar = Event[];
    export interface Dictionary {
        start: {
            major: string[];
            minor: string[];
        };
        common: {
            major: any;
            minor: any;
        };
        specific?: any;
    }
    export type EventType = "normal" | "cadence" | "end";
    export type Inversion = 0 | 1 | 2 | 3;
    export type Modifier = "" | "7" | "o7";
    export type Part = "s" | "a" | "t" | "b";
    export const PARTS: Part[] = ["s", "a", "t", "b"];

    export abstract class Printable {
        abstract string(): string;
    }

    export interface Settings {
        dictionary: Dictionary;
        maxJump: number;
        doubledMajorThird: boolean;
        doubledMinorThird: boolean;
        absentFifth: boolean;
        parallelFifths: boolean;
        parallelOctaves: boolean;
        tessiture: Parts<Tessitura>;
    }

    export interface Tessitura {
        min: number;
        max: number;
    }

    export interface Time {
        barIndex: number;
        eventIndex: number;
    }
}

export default Util;
