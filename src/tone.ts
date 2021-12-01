import BasicTone from "./basictone.js";

export default class Tone extends BasicTone {
    octave;

    constructor(letter: number, accidental: number, octave: number) {
        super(letter, accidental);
        this.octave = octave;
    }

    static parse(string: string) {
        const result = string.match(/^([A-G])(bb|b|#|x|)([1-6])$/);
        if (result === null) {
            throw new Error(`Could not parse tone '${string}'`);
        }
        return new Tone(Tone.LETTERS.indexOf(result[1]), Tone.ACCIDENTALS.indexOf(result[2]), Number(result[3]));
    }

    get pitch() {
        return super.pitch + 12 * this.octave;
    }

    near(tone: BasicTone) {
        const tone1 = new Tone(tone.letter, tone.accidental, this.octave - 1);
        const tone2 = new Tone(tone.letter, tone.accidental, this.octave);
        const tone3 = new Tone(tone.letter, tone.accidental, this.octave + 1);
        return [tone1, tone2, tone3].sort((l, r) => Math.abs(this.pitch - l.pitch) - Math.abs(this.pitch - r.pitch));
    }

    get string() {
        return super.string + this.octave;
    }
}
