import Numeral from "./numeral.js";
import Tone from "./tone.js";

export default class BaseNumeral extends Numeral {
    acc;

    constructor(acc: number, deg: number, ton: boolean) {
        super(deg, ton);
        this.acc = acc;
    }

    static parse(string: string) {
        const result = string.match(/(b|#|)(III|iii|VII|vii|II|ii|IV|iv|VI|vi|I|i|V|v)/);
        return new BaseNumeral(Tone.ACC.indexOf(result[1]), BaseNumeral.NUM.indexOf(result[2].toLowerCase()), result[2] === result[2].toUpperCase());
    }

    string() {
        return Tone.ACC[this.acc] + super.string();
    }
}
