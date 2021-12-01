import BasicTone from "./basictone.js";
import { Inversion } from "./util.js";

export default class Resolution {
    "0";
    "1";
    "2";
    "3";
    inversion: Inversion;

    constructor(root: BasicTone, third: BasicTone, fifth: BasicTone, seventh: BasicTone | null, inversion: Inversion) {
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
        return this[inversion] as BasicTone;
    }

    excludes(testTone: BasicTone | undefined) {
        if (testTone === undefined) {
            return false;
        }
        return this.array.every(tone => !tone?.equals(testTone));
    }

    get array() {
        return Array.from(this).filter(tone => tone !== null) as BasicTone[]
    }

    get string() {
        return `{${(Array.from(this).filter(tone => tone !== null) as BasicTone[]).map((tone, inversion) => inversion === this.inversion ? `(${tone.string})` : tone.string).join(" ")}}`;
    }
}
