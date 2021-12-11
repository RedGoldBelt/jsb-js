import Key from "./key.js";
import Numeral from "./numeral.js";
import Resolution from "./resolution.js";
import Tone from "./tone.js";
import Util from "./util.js";

export default class Chord implements Util.Printable {
    private static INVERSIONS = ["a", "b", "c", "d"];

    private base;
    private alteration;
    private inversion;
    private relativeKey;

    constructor(base: Numeral | undefined, alteration: Util.Alteration, inversion: Util.Inversion, relativeKey: Numeral) {
        this.base = base;
        this.alteration = alteration;
        this.inversion = inversion;
        this.relativeKey = relativeKey;
    }

    static parse(string: string) {
        const result = string.match(/^((b|#|)(III|iii|VII|vii|II|ii|IV|iv|VI|vi|I|i|V|v))(o7|7|)([a-d])?(\/((b|#|)(III|iii|VII|vii|II|ii|IV|iv|VI|vi|I|i|V|v)))?$/);
        if (result === null) {
            throw `Could not parse chord '${string}'.`;
        }
        return new Chord(
            Numeral.parse(result[1]),
            result[4] as Util.Alteration,
            (result[5] ? Chord.INVERSIONS.indexOf(result[5]) : 0) as Util.Inversion,
            Numeral.parse(result[6] ? result[7] : "I")
        );
    }

    resolve(key: Key) {
        if (this.base === undefined) {
            throw "Cannot resolve null chord.";
        }
        if (this.relativeKey) {
            key = new Key(key.degree(this.relativeKey.getDegree()), this.relativeKey.getTonality());
        }

        const rootPitch = key.degree(this.base.getDegree()).alterAccidental(this.base.getAccidental()).semitones() - key.degree(0).semitones();
        const third = key.degree(this.base.getDegree() + 2, rootPitch + (this.base.getTonality() ? 4 : 3));
        let fifth: Tone;
        let seventh: Tone | undefined;

        switch (this.alteration) {
            case "":
                fifth = key.degree(this.base.getDegree() + 4);
                break;
            case "o7":
                fifth = key.degree(this.base.getDegree() + 4, rootPitch + 6);
                seventh = key.degree(this.base.getDegree() + 6, rootPitch + 9);
                break;
            case "7":
                fifth = key.degree(this.base.getDegree() + 4);
                seventh = key.degree(this.base.getDegree() + 6);
                break;
        }

        return new Resolution(key.degree(this.base.getDegree()).alterAccidental(this.base.getAccidental()), third, fifth, seventh, this.inversion);
    }

    progression(dictionary: Util.Dictionary) {
        if (this.base === undefined) {
            return dictionary.start[this.relativeKey.getTonality() ? "major" : "minor"].map(Chord.parse);
        }
        const specific = dictionary.specific?.[this.relativeKey.string()]?.[this.stringStem()] as string[];
        const specificOptions = specific?.map(Chord.parse) ?? [];
        const common = dictionary.common[this.relativeKey.getTonality() ? "major" : "minor"][this.stringStem()] as string[];
        const commonOptions = common?.map(string => Chord.parse(string).setRelativeKey(this.relativeKey)) ?? [];

        return specificOptions?.concat(commonOptions) ?? commonOptions;
    }

    getBase() {
        return this.base;
    }

    setBase(base: Numeral) {
        this.base = base;
        return this;
    }

    getAlteration() {
        return this.alteration;
    }

    setAlteration(alteration: Util.Alteration) {
        this.alteration = alteration;
        return this;
    }

    getInversion() {
        return this.inversion;
    }

    setInversion(inversion: Util.Inversion) {
        this.inversion = inversion;
        return this;
    }

    getRelativeKey() {
        return this.relativeKey;
    }

    setRelativeKey(relativeKey: Numeral) {
        this.relativeKey = relativeKey;
        return this;
    }

    stringStem() {
        return this.base?.string() + this.alteration + (this.inversion ? Chord.INVERSIONS[this.inversion] : "");
    }

    string() {
        let string = this.stringStem();
        string += "/" + this.relativeKey.string();
        return string;
    }
}
