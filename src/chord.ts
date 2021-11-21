import Key from "./key.js";
import BaseNumeral from "./baseNumeral.js";
import Numeral from "./numeral.js";
import Tone from "./tone.js";
import { Alteration } from "./util.js";
import Resolution from "./resolution.js";

export default class Chord {
    private static INV = ["a", "b", "c", "d"];

    base;
    alt;
    inv;
    keyNumeral;

    constructor(base: BaseNumeral, alt: Alteration, inv: number, key: Numeral) {
        this.base = base;
        this.alt = alt;
        this.inv = inv;
        this.keyNumeral = key;
    }

    static parse(string: string) {
        if (string === "") return undefined;
        const result = string.match(/((b|#|)(III|iii|VII|vii|II|ii|IV|iv|VI|vi|I|i|V|v))(o7|7|)([a-d])?(\/((III|iii|VII|vii|II|ii|IV|iv|VI|vi|I|i|V|v)))?/);
        return new Chord(
            BaseNumeral.parse(result[1]),
            result[4] as Alteration,
            (result[5] ? Chord.INV.indexOf(result[5]) : 0),
            result[6] ? Numeral.parse(result[7]) : undefined
        );
    }

    static all(string: string) {
        const c = Chord.parse(string);
        const a = [(c.inv = 2, c.stringFull()), (c.inv = 1, c.stringFull()), (c.inv = 0, c.stringFull())];
        if (c.alt) a.unshift((c.inv = 3, c.stringFull()));
        return a;
    }

    setInv(inv: number) {
        this.inv = inv;
        return this;
    }

    resolve(key: Key) {
        key = new Key(key.degree(this.keyNumeral.deg), this.keyNumeral.ton)
        const rootPitch = key.degree(this.base.deg).alter(this.base.acc).pitch() - key.degree(0).pitch();
        const third = key.degree(this.base.deg + 2, rootPitch + (this.base.ton ? 4 : 3));
        let fifth: Tone;
        let seventh: Tone;

        switch (this.alt) {
            case "":
                fifth = key.degree(this.base.deg + 4);
                break;
            case "o7":
                fifth = key.degree(this.base.deg + 4, rootPitch + 6);
                seventh = key.degree(this.base.deg + 6, rootPitch + 9);
                break;
            case "7":
                fifth = key.degree(this.base.deg + 4, rootPitch + 7);
                seventh = key.degree(this.base.deg + 6);
                break;
        }
        return new Resolution(key.degree(this.base.deg).alter(this.base.acc), third, fifth, seventh, this.inv);
    }

    prog(dict: any): Chord[] {
        const SPEC = dict["SPEC_" + this.keyNumeral.string()];
        const SPEC_OPT = SPEC[this.string()].flat().map(Chord.parse);
        const COM = this.keyNumeral.ton ? dict.COM_MAJ : dict.COM_MIN;
        const COM_OPT = COM[this.string()].flat().map((string: string) => {
            const c = Chord.parse(string);
            c.keyNumeral = this.keyNumeral;
            return c;
        });
        return SPEC_OPT.concat(COM_OPT);
    }

    string() { return this.base ? this.base.string() + this.alt + (this.inv ? Chord.INV[this.inv] : "") : null; }

    stringFull() { return this.string() + (this.keyNumeral ? "/" + this.keyNumeral.string() : "") }
}
