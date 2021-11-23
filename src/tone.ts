export default class Tone {
    static ACCIDENTALS = ["", "#", "x"];
    private static LETTERS = ["C", "D", "E", "F", "G", "A", "B"];
    private static PITCHES = [0, 2, 4, 5, 7, 9, 11];

    letter;
    accidental;

    constructor(letter: number, accidental: number) {
        this.letter = letter; this.accidental = accidental;
    }

    static parse(string: string) {
        const result = string.match(/^([A-G])(bb|x|b|#|)$/);
        if (result === null) {
            throw new Error(`Could not parse tone '${string}'`);
        }
        return new Tone(Tone.LETTERS.indexOf(result[1]), Tone.ACCIDENTALS.indexOf(result[2]));
    }

    get pitch() {
        return Tone.PITCHES[this.letter] + this.accidental;
    }

    equals(tone: Tone | undefined) {
        if (tone === undefined) {
            return false;
        }
        return this.letter === tone.letter && this.accidental === tone.accidental;
    }

    alter(accidental: number) {
        this.accidental += accidental; return this;
    }

    get string() {
        return Tone.LETTERS[this.letter] + Tone.ACCIDENTALS[this.accidental];
    }
}

Tone.ACCIDENTALS[-2] = "bb";
Tone.ACCIDENTALS[-1] = "b";
