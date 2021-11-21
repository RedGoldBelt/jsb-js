import Numeral from "./numeral.js";
import Tone from "./tone.js";

export default class BaseNumeral extends Numeral {
    accidental;

    constructor(accidental: number, degree: number, tonality: boolean) {
        super(degree, tonality);
        this.accidental = accidental;
    }

    static parse(string: string) {
        const result = string.match(/^(b|#|)(III|iii|VII|vii|II|ii|IV|iv|VI|vi|I|i|V|v)$/);
        if (result === null) {
            throw new Error(`Could not parse base numeral '${string}'`);
        }
        return new BaseNumeral(Tone.ACCIDENTALS.indexOf(result[1]), BaseNumeral.NUMERALS.indexOf(result[2].toLowerCase()), result[2] === result[2].toUpperCase());
    }

    string() {
        return Tone.ACCIDENTALS[this.accidental] + super.string();
    }
}
