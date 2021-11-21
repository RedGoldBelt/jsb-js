import Tone from "./tone.js";

export default class Key {
    tone;
    ton;

    constructor(tone: Tone, tonality: boolean) { this.tone = tone; this.ton = tonality; }

    static parse(string: string) {
        const result = string.match(/(C|D|E|F|G|A|B)(bb|x|b|#|) (major|minor)/);
        return new Key(Tone.parse(result[1] + result[2]), result[3] === "major");
    }

    degree(deg: number, relPitch?: number) {
        deg %= 7;
        relPitch ??= (this.ton ? [0, 2, 4, 5, 7, 9, 11] : [0, 2, 3, 5, 7, 8, 10])[deg];
        const top = new Tone((this.tone.letter + deg) % 7, 0);
        top.acc = (relPitch - top.pitch() + this.tone.pitch() + 18) % 12 - 6;
        return top;
    }

    string() { return this.tone.string() + " " + (this.ton ? "major" : "minor"); }
}
