import Slice from "./slice";

export interface Config {
    dictionary?: any;
    debug?: boolean;
}

export type Alteration = "" | "7" | "o7";

export type Bar = Slice[];

export type Part = "s" | "a" | "t" | "b";

export type Inversion = 0 | 1 | 2 | 3;

export interface Permutation {
    altoInversion: Inversion;
    tenorInversion: Inversion;
    score: number;
}

export interface Time {
    bar: number;
    slice: number;
}
