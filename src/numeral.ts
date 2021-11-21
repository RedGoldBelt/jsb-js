export default class Numeral {
    static NUMERALS = ["i", "ii", "iii", "iv", "v", "vi", "vii"];

    degree;
    tonality;

    constructor(degree: number, tonality: boolean) {
        this.degree = degree;
        this.tonality = tonality;
    }

    static parse(string: string) {
        const result = string.match(/^III|iii|VII|vii|II|ii|IV|iv|VI|vi|I|i|V|v$/);
        if (result === null) {
            throw new Error(`Could not parse numeral '${string}'`);
        }
        return new Numeral(Numeral.NUMERALS.indexOf(string.toLowerCase()), string === string.toUpperCase());
    }

    string() {
        return Numeral.NUMERALS[this.degree][this.tonality ? "toUpperCase" : "toLowerCase"]();
    }
}
