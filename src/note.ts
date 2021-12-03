import BasicTone from "./basictone.js";
import Tone from "./tone.js";

export default class Note extends Tone {
    private static PREVIOUS: Tone = Tone.parse("C4");

    duration: number;
    private tie: boolean;
    harmonic: boolean;

    constructor(harmonic: boolean, letter: number, accidental: number, octave: number, duration: number, tie: boolean) {
        super(letter, accidental, octave);
        this.duration = duration;
        this.tie = tie;
        this.harmonic = harmonic;
    }

    static parse(string: string) {
        const result = string.match(/^(&?)([A-G])(bb|b|#|x|)([1-6]?)(_*)(\/*)(\.*)(~?)$/);
        if (result === null) {
            throw new Error(`Could not parse note '${string}'`);
        }
        return Note.PREVIOUS = new Note(
            result[1] === "&",
            Note.LETTERS.indexOf(result[2]),
            Note.ACCIDENTALS.indexOf(result[3]),
            result[4] === "" ? Note.PREVIOUS.near(BasicTone.parse(result[2] + result[3]))[0].octave : Number(result[4]),
            2 ** (result[5].length - result[6].length) * 1.5 ** result[7].length,
            result[8] === "~"
        );
    }
}
