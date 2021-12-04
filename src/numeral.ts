import Tone from "./tone.js";

export default class Numeral {
    static NUMERALS = ["i", "ii", "iii", "iv", "v", "vi", "vii"];

    accidental;
    degree;
    tonality;

    constructor(accidental: number, degree: number, tonality: boolean) {
        this.accidental = accidental;
        this.degree = degree;
        this.tonality = tonality;
    }

    static parse(string: string) {
        const result = string.match(/^(b|#|)(III|iii|VII|vii|II|ii|IV|iv|VI|vi|I|i|V|v)$/);
        if (result === null) {
            throw new Error(`Could not parse numeral '${string}'`);
        }
        return new Numeral(Tone.ACCIDENTALS.indexOf(result[1]), Numeral.NUMERALS.indexOf(result[2].toLowerCase()), result[2] === result[2].toUpperCase());
    }

    toString() {
        return Tone.ACCIDENTALS[this.accidental] + Numeral.NUMERALS[this.degree][this.tonality ? "toUpperCase" : "toLowerCase"]();
    }
}
