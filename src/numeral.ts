class Numeral implements Printable {
    static NUMERALS = ["i", "ii", "iii", "iv", "v", "vi", "vii"];

    private accidental;
    private degree;
    private tonality;

    constructor(accidental: number, degree: number, tonality: boolean) {
        this.accidental = accidental;
        this.degree = degree;
        this.tonality = tonality;
    }

    static parse(string: string) {
        const result = string.match(/^(b|#|)(III|iii|VII|vii|II|ii|IV|iv|VI|vi|I|i|V|v)$/);
        if (result === null) {
            throw `Could not parse numeral '${string}'`;
        }
        return new Numeral(Tone.ACCIDENTALS.indexOf(result[1]), Numeral.NUMERALS.indexOf(result[2].toLowerCase()), result[2] === result[2].toUpperCase());
    }

    getAccidental() {
        return this.accidental;
    }

    setAccidental(accidental: number) {
        this.accidental = accidental;
        return this;
    }

    getDegree() {
        return this.degree;
    }

    setDegree(degree: number) {
        this.degree = degree;
        return this;
    }

    getTonality() {
        return this.tonality;
    }

    setTonality(tonality: boolean) {
        this.tonality = tonality;
        return this;
    }

    string() {
        return Tone.ACCIDENTALS[this.accidental] + Numeral.NUMERALS[this.degree][this.tonality ? "toUpperCase" : "toLowerCase"]();
    }
}
