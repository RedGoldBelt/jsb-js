import Key from "./key.js";
import Numeral from "./numeral.js";
import Resolution from "./resolution.js";
import Tone from "./tone.js";
import { Printable, Alteration, Inversion } from "./util.js";

export default class Chord implements Printable {
    private static INVERSIONS = ["a", "b", "c", "d"];

    private base;
    private alteration;
    private inversion;
    private relativeKey;

    constructor(base: Numeral | null, alteration: Alteration, inversion: Inversion, relativeKey: Numeral) {
        this.base = base;
        this.alteration = alteration;
        this.inversion = inversion;
        this.relativeKey = relativeKey;
    }

    static parse(string: string) {
        const result = string.match(/^((b|#|)(III|iii|VII|vii|II|ii|IV|iv|VI|vi|I|i|V|v))(o7|7|)([a-d])?(\/((b|#|)(III|iii|VII|vii|II|ii|IV|iv|VI|vi|I|i|V|v)))?$/);
        if (result === null) {
            throw new Error(`Could not parse chord '${string}'`);
        }
        return new Chord(
            Numeral.parse(result[1]),
            result[4] as Alteration,
            (result[5] ? Chord.INVERSIONS.indexOf(result[5]) : 0) as Inversion,
            result[6] ? Numeral.parse(result[7]) : Numeral.parse("I")
        );
    }

    resolve(key: Key) {
        if (this.base === null) {
            throw new Error("Cannot resolve chord with base 'null'");
        }

        if (this.relativeKey) {
            key = new Key(key.degree(this.relativeKey.degree), this.relativeKey.tonality);
        }

        const rootPitch = key.degree(this.base.degree).alter(this.base.accidental).semitones() - key.degree(0).semitones();
        const third = key.degree(this.base.degree + 2, rootPitch + (this.base.tonality ? 4 : 3));
        let fifth: Tone;
        let seventh: Tone | undefined;

        switch (this.alteration) {
            case "":
                fifth = key.degree(this.base.degree + 4);
                break;
            case "o7":
                fifth = key.degree(this.base.degree + 4, rootPitch + 6);
                seventh = key.degree(this.base.degree + 6, rootPitch + 9);
                break;
            case "7":
                fifth = key.degree(this.base.degree + 4);
                seventh = key.degree(this.base.degree + 6);
                break;
        }

        return new Resolution(key.degree(this.base.degree).alter(this.base.accidental), third, fifth, seventh, this.inversion);
    }

    progression(dictionary: any) {
        if (this.relativeKey === null) {
            throw new Error("Cannot calculate progressions of a chord with no relative key");
        }
        const SPECIFIC = dictionary["SPECIFIC_" + this.relativeKey.toString()];
        const SPECIFIC_OPTIONS = SPECIFIC?.[this.toStringStem()].map(Chord.parse) as Chord[];
        const COMMON = this.relativeKey.tonality ? dictionary.COMMON_MAJOR : dictionary.COMMON_MINOR;
        const COMMON_OPTIONS = COMMON[this.toStringStem()].map((string: string) => {
            const chord = Chord.parse(string);
            chord.relativeKey = this.relativeKey;
            return chord;
        }) as Chord[];

        return SPECIFIC_OPTIONS ? SPECIFIC_OPTIONS.concat(COMMON_OPTIONS) : COMMON_OPTIONS;
    }

    getInversion() {
        return this.inversion;
    }

    toStringStem() {
        return this.base ? this.base.toString() + this.alteration + (this.inversion ? Chord.INVERSIONS[this.inversion] : "") : "null";
    }

    toString() {
        let string = this.toStringStem();
        if (!(this.relativeKey.degree === 0 && this.relativeKey.accidental === 0)) {
            string += "/" + this.relativeKey.toString();
        }
        return string;
    }
}
