import Chord from "./chord.js";
import Key from "./key.js";
import Tone from "./tone.js";
import { Inversion } from "./util.js";

export default class Resolution {
    "0";
    "1";
    "2";
    "3";
    inversion: Inversion;

    constructor(root: Tone, third: Tone, fifth: Tone, seventh: Tone | null, inversion: Inversion) {
        this[0] = root;
        this[1] = third;
        this[2] = fifth;
        this[3] = seventh;
        this.inversion = inversion;
    }

    *[Symbol.iterator]() {
        for (let inversion of [0, 1, 2, 3] as Inversion[]) {
            yield this[inversion];
        }
    }

    at(inversion: Inversion) {
        return this[inversion] as Tone;
    }

    excludes(testTone: Tone | undefined) {
        if (testTone === undefined) {
            return false;
        }
        return this.array().every(tone => !tone?.equals(testTone));
    }

    array() {
        return Array.from(this).filter(tone => tone !== null) as Tone[]
    }

    string() {
        return (Array.from(this).filter(tone => tone !== null) as Tone[]).map((tone, inversion) => inversion === this.inversion ? `(${tone.string()})` : tone.string()).join(" ");
    }
}
