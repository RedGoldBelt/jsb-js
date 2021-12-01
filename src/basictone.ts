export default class BasicTone {
    static ACCIDENTALS = ["", "#", "x"];
    protected static LETTERS = ["C", "D", "E", "F", "G", "A", "B"];
    protected static PITCHES = [0, 2, 4, 5, 7, 9, 11];

    letter;
    accidental;

    constructor(letter: number, accidental: number) {
        this.letter = letter;
        this.accidental = accidental;
    }

    static parse(string: string) {
        const result = string.match(/^([A-G])(bb|x|b|#|)$/);
        if (result === null) {
            throw new Error(`Could not parse tone '${string}'`);
        }
        return new BasicTone(BasicTone.LETTERS.indexOf(result[1]), BasicTone.ACCIDENTALS.indexOf(result[2]));
    }

    get pitch() {
        return BasicTone.PITCHES[this.letter] + this.accidental;
    }

    equals(tone: BasicTone | undefined) {
        if (tone === undefined) {
            return false;
        }
        return this.letter === tone.letter && this.accidental === tone.accidental;
    }

    alter(accidental: number) {
        this.accidental += accidental; return this;
    }

    get string() {
        return BasicTone.LETTERS[this.letter] + BasicTone.ACCIDENTALS[this.accidental];
    }
}

BasicTone.ACCIDENTALS[-2] = "bb";
BasicTone.ACCIDENTALS[-1] = "b";
