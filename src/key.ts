import Tone from "./tone.js";

export default class Key {
    private tone;
    private tonality;

    constructor(tone: Tone, tonality: boolean) {
        this.tone = tone;
        this.tonality = tonality;
    }

    static parse(string: string) {
        const result = string.match(/^(C|D|E|F|G|A|B)(bb|x|b|#|) (major|minor)$/);
        if (result === null) {
            throw `Could not parse key '${string}'`;
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
