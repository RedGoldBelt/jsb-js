import Tone from "./tone.js";

export default class Pitch {
    tone: Tone;
    octave;

    constructor(tone: Tone, octave: number) {
        this.tone = tone;
        this.octave = octave;
    }

    static parse(string: string) {
        const result = string.match(/^([A-G](bb|b|#|x|))([1-6])$/);
        if (result === null) {
            throw new Error(`Could not parse tone '${string}'`);
        }
        return new Pitch(Tone.parse(result[1]), Number(result[3]));
    }

    get semitones() {
        return this.tone.semitones + 12 * this.octave;
    }

    near(tone: Tone) {
        const tone1 = new Pitch(tone, this.octave - 1);
        const tone2 = new Pitch(tone, this.octave);
        const tone3 = new Pitch(tone, this.octave + 1);
        return [tone1, tone2, tone3].sort((l, r) => Math.abs(this.semitones - l.semitones) - Math.abs(this.semitones - r.semitones));
    }

    get string() {
        return this.tone.string + this.octave;
    }
}
