import Tone from "./tone.js";

export default class Note {
    tone;
    octave;

    constructor(tone: Tone, octave: number) {
        this.tone = tone; this.octave = octave;
    }

    static parse(string: string) {
        const result = string.match(/^([A-G])(bb|b|#|x|)([1-6])$/);
        if (result === null) {
            throw new Error(`Could not parse note '${string}'`);
        }
        return new Note(Tone.parse(result[1] + result[2]), Number(result[3]));
    }

    pitch() {
        return this.tone.pitch() + 12 * this.octave;
    }

    near(tone: Tone) {
        const note1 = new Note(tone, this.octave - 1);
        const note2 = new Note(tone, this.octave);
        const note3 = new Note(tone, this.octave + 1);
        return [note1, note2, note3].sort((l, r) => Math.abs(this.pitch() - l.pitch()) - Math.abs(this.pitch() - r.pitch()));
    }

    string() {
        return this.tone.string() + this.octave;
    }
}
