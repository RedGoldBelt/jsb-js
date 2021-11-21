import Key from "./key.js";
import BaseNumeral from "./baseNumeral.js";
import Numeral from "./numeral.js";
import Tone from "./tone.js";
import { Alteration, Inversion } from "./util.js";
import Resolution from "./resolution.js";

export default class Chord {
    private static INVERSIONS = ["a", "b", "c", "d"];

    base;
    alteration;
    inversion;
    relativeKey;

    constructor(base: BaseNumeral | null, alteration: Alteration, inversion: Inversion, relativeKey: Numeral | null) {
        this.base = base;
        this.alteration = alteration;
        this.inversion = inversion;
        this.relativeKey = relativeKey;
    }

    static parse(string: string) {
        const result = string.match(/^((b|#|)(III|iii|VII|vii|II|ii|IV|iv|VI|vi|I|i|V|v))(o7|7|)([a-d])?(\/((III|iii|VII|vii|II|ii|IV|iv|VI|vi|I|i|V|v)))?$/);
        if (result === null) {
            throw new Error(`Could not parse chord '${string}'`);
        }
        return new Chord(
            BaseNumeral.parse(result[1]),
            result[4] as Alteration,
            (result[5] ? Chord.INVERSIONS.indexOf(result[5]) : 0) as Inversion,
            result[6] ? Numeral.parse(result[7]) : null
        );
    }

    static all(string: string) {
        const chord = Chord.parse(string);
        const all = [(chord.inversion = 2, chord.stringFull()), (chord.inversion = 1, chord.stringFull()), (chord.inversion = 0, chord.stringFull())];
        if (chord.alteration) all.unshift((chord.inversion = 3, chord.stringFull()));
        return all;
    }

    setInversion(inversion: Inversion) {
        this.inversion = inversion;
        return this;
    }

    resolve(key: Key) {
        if (this.base === null) {
            throw new Error("Cannot resolve chord with base 'null'");
        }

        if (this.relativeKey) {
            key = new Key(key.degree(this.relativeKey.degree), this.relativeKey.tonality);
        }

        const rootPitch = key.degree(this.base.degree).alter(this.base.accidental).pitch() - key.degree(0).pitch();
        const third = key.degree(this.base.degree + 2, rootPitch + (this.base.tonality ? 4 : 3));
        let fifth: Tone;
        let seventh: Tone | null = null;

        switch (this.alteration) {
            case "":
                fifth = key.degree(this.base.degree + 4);
                break;
            case "o7":
                fifth = key.degree(this.base.degree + 4, rootPitch + 6);
                seventh = key.degree(this.base.degree + 6, rootPitch + 9);
                break;
            case "7":
                fifth = key.degree(this.base.degree + 4, rootPitch + 7);
                seventh = key.degree(this.base.degree + 6);
                break;
        }

        return new Resolution(key.degree(this.base.degree).alter(this.base.accidental), third, fifth, seventh, this.inversion);
    }

    progression(dictionary: any) {
        if (this.relativeKey === null) {
            throw new Error("Cannot calculate progressions of a chord with no relative key");
        }
        const SPECIFIC = dictionary["SPECIFIC_" + this.relativeKey.string()];
        const SPECIFIC_OPTIONS = SPECIFIC[this.string()].flat().map(Chord.parse) as Chord[];
        const COMMON = this.relativeKey.tonality ? dictionary.COMMON_MAJOR : dictionary.COMMON_MINOR;
        const COMMON_OPTIONS = COMMON[this.string()].flat().map((string: string) => {
            const chord = Chord.parse(string);
            chord.relativeKey = this.relativeKey;
            return chord;
        }) as Chord[];
        return SPECIFIC_OPTIONS.concat(COMMON_OPTIONS);
    }

    string() {
        return this.base ? this.base.string() + this.alteration + (this.inversion ? Chord.INVERSIONS[this.inversion] : "") : "null";
    }

    stringFull() {
        return this.string() + (this.relativeKey ? "/" + this.relativeKey.string() : "")
    }
}
