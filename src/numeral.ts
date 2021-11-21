export default class Numeral {
    static NUM = ["i", "ii", "iii", "iv", "v", "vi", "vii"];

    deg;
    ton;

    constructor(deg: number, ton: boolean) { this.deg = deg; this.ton = ton; }

    static parse(string: string) { return new Numeral(Numeral.NUM.indexOf(string.toLowerCase()), string === string.toUpperCase()); }

    string() { return Numeral.NUM[this.deg][this.ton ? "toUpperCase" : "toLowerCase"](); }
}
