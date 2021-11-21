import Tone from "./tone.js";

export default class Note {
    tone;
    oct;

    constructor(tone: Tone, oct: number) { this.tone = tone; this.oct = oct; }

    static parse(string: string) {
        const result = string.match(/([A-G])(bb|b|#|x|)([1-6])/);
        return new Note(Tone.parse(result[1] + result[2]), Number(result[3]));
    }

    pitch() { return this.tone.pitch() + 12 * this.oct; }

    near(tone: Tone) {
        const note1 = new Note(tone, this.oct - 1);
        const note2 = new Note(tone, this.oct);
        const note3 = new Note(tone, this.oct + 1);
        return [note1, note2, note3].sort((l, r) => Math.abs(this.pitch() - l.pitch()) - Math.abs(this.pitch() - r.pitch()));
    }

    string() { return this.tone.string() + this.oct; }
}
