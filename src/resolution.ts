import Tone from "./tone.js";

export default class Resolution {
    inv;

    constructor(root: Tone, third: Tone, fifth: Tone, seventh: Tone, inv: number) {
        this[0] = root;
        this[1] = third;
        this[2] = fifth;
        this[3] = seventh;
        this.inv = inv;
    }

    *[Symbol.iterator]() { for (let i = 0; i < 4; ++i) yield this[i]; }

    excl(testTone: Tone) { return testTone ? Array.from(this).filter(tone => tone).every(tone => !tone?.eq(testTone)) : false; }

    string() { return Array.from(this).filter(tone => tone).map((tone, inv) => inv === this.inv ? "(" + tone.string() + ")" : tone.string()).join(" "); }
}
