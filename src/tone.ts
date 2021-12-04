import { Printable } from "./util";

export default class Tone implements Printable {
    static ACCIDENTALS = ["", "#", "x"];
    static {
        Tone.ACCIDENTALS[-2] = "bb";
        Tone.ACCIDENTALS[-1] = "b";
    }
    static LETTERS = ["C", "D", "E", "F", "G", "A", "B"];
    private static PITCHES = [0, 2, 4, 5, 7, 9, 11];

    private letter;
    private accidental;

    constructor(letter: number, accidental: number) {
        this.letter = letter;
        this.accidental = accidental;
    }

    static parse(string: string) {
        const result = string.match(/^([A-G])(bb|x|b|#|)$/);
        if (result === null) {
            throw new Error(`Could not parse tone '${string}'`);
        }
        return new Tone(Tone.LETTERS.indexOf(result[1]), Tone.ACCIDENTALS.indexOf(result[2]));
    }

    semitones() {
        return Tone.PITCHES[this.letter] + this.accidental;
    }

    equals(tone: Tone | undefined) {
        if (tone === undefined) {
            return false;
        }
        return this.letter === tone.letter && this.accidental === tone.accidental;
    }

    getLetter() {
        return this.letter;
    }

    setLetter(letter: number) {
        this.letter = letter;
        return this;
    }

    getAccidental() {
        return this.accidental;
    }

    setAccidental(accidental: number) {
        this.accidental = accidental;
        return this;
    }

    alterAccidental(accidental: number) {
        this.accidental += accidental; return this;
    }

    string() {
        return Tone.LETTERS[this.letter] + Tone.ACCIDENTALS[this.accidental];
    }
}
