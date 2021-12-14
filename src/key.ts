import Printable from "./printable.js";
import Tone from "./tone.js";

export default class Key implements Printable {
    tone;
    tonality;

    constructor(tone: Tone, tonality: boolean) {
        this.tone = tone;
        this.tonality = tonality;
    }

    static parse(string: string) {
        const result = string.match(/^(C|D|E|F|G|A|B)(bb|x|b|#|) (major|minor)$/);
        if (result === null) {
            throw `Could not parse key '${string}'.`;
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

    accidentals() {
        let accidentals = (2 * this.tone.letter) % 7 + 7 * this.tone.accidental;
        if (this.tone.letter === 3) {
            accidentals -= 7;
        }
        if (!this.tonality) {
            accidentals -= 3;
        }
        return accidentals;
    }

    signature() {
        const accidentals = this.accidentals();
        return [
            Math.floor((accidentals + 5) / 7),
            Math.floor((accidentals + 3) / 7),
            Math.floor((accidentals + 1) / 7),
            Math.floor((accidentals + 6) / 7),
            Math.floor((accidentals + 4) / 7),
            Math.floor((accidentals + 2) / 7),
            Math.floor(accidentals / 7)
        ];
    }

    string() {
        return this.tone.string() + " " + (this.tonality ? "major" : "minor");
    }
}
