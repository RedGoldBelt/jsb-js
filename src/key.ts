import Tone from "./tone.js";
import Util from "./util.js";

export default class Key implements Util.Printable {
    private tone;
    private tonality;

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
        relativePitch ??= (this.getTonality() ? [0, 2, 4, 5, 7, 9, 11] : [0, 2, 3, 5, 7, 8, 10])[degree];
        const top = new Tone((this.getTone().getLetter() + degree) % 7, 0);
        top.setAccidental((relativePitch - top.semitones() + this.getTone().semitones() + 18) % 12 - 6);
        return top;
    }

    accidentals() {
        let accidentals = (2 * this.getTone().getLetter()) % 7 + 7 * this.getTone().getAccidental();
        if (this.getTone().getLetter() === 3) {
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

    getTone() {
        return this.tone;
    }

    setTone(tone: Tone) {
        this.tone = tone;
        return this;
    }

    getTonality() {
        return this.tonality;
    }

    setTonality(tonality: boolean) {
        this.tonality = tonality;
        return this;
    }

    string() {
        return this.getTone().string() + " " + (this.getTonality() ? "major" : "minor");
    }
}
