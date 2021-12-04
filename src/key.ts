import Tone from "./tone.js";

export default class Key {
    tone;
    tonality;

    constructor(tone: Tone, tonality: boolean) {
        this.tone = tone; this.tonality = tonality;
    }

    static parse(string: string) {
        const result = string.match(/^(C|D|E|F|G|A|B)(bb|x|b|#|) (major|minor)$/);
        if (result === null) {
            throw new Error(`Could not parse key '${string}'`);
        }
        return new Key(Tone.parse(result[1] + result[2]), result[3] === "major");
    }

    degree(degree: number, relativePitch?: number) {
        degree %= 7;
        relativePitch ??= (this.tonality ? [0, 2, 4, 5, 7, 9, 11] : [0, 2, 3, 5, 7, 8, 10])[degree];
        const top = new Tone((this.tone.letter + degree) % 7, 0);
        top.accidental = (relativePitch - top.semitones() + this.tone.semitones() + 18) % 12 - 6;
        return top;
    }

    toString() {
        return this.tone.toString() + " " + (this.tonality ? "major" : "minor");
    }
}
