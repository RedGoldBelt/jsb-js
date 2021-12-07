import EventGroup from "./event.js";
import Pitch from "./pitch.js";

export type Alteration = "" | "7" | "o7";

export type Bar = EventGroup[];

export type Inversion = 0 | 1 | 2 | 3;

export type Part = "s" | "a" | "t" | "b";

export interface Permutation {
    a: Pitch;
    t: Pitch;
    score: number;
}

export interface Time {
    bar: number;
    event: number;
}

export abstract class Printable {
    abstract string(): string;
}
