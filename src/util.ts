import Event from "./event.js";
import Pitch from "./pitch.js";

namespace Util {
    export type Alteration = "" | "7" | "o7";
    export type Bar = Event[];

    export interface Parts<T> {
        s: T;
        a: T;
        t: T;
        b: T;
    }

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
    export interface Settings {
        dictionary: Dictionary; // IMPLEMENT OPTIONS
        maxJump: number;
        doubledMajorThird: boolean;
        doubledMinorThird: boolean;
        absentFifth: boolean;
        parallelFifths: boolean;
        parallelOctaves: boolean;
        augmentedSecondInterval: boolean;
        tessitura : Parts<Tessitura>;
    }
    export type Part = "s" | "a" | "t" | "b";
    export const PARTS: Part[] = ["s", "a", "t", "b"];

    export interface Permutation {
        a: Pitch;
        t: Pitch;
        score: number;
    }

    export abstract class Printable {
        abstract string(): string;
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
