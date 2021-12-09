type Alteration = "" | "7" | "o7";

type Bar = Event[];

type Inversion = 0 | 1 | 2 | 3;

type Part = "s" | "a" | "t" | "b";

interface Permutation {
    a: Pitch;
    t: Pitch;
    score: number;
}

interface Time {
    bar: number;
    event: number;
}

abstract class Printable {
    abstract string(): string;
}
