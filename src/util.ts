import Chord from "./chord.js";
import Slice from "./slice";

export interface Config {
    dictionary?: any;
    debug?: boolean;
}

export type Alteration = "" | "7" | "o7";

export type Bar = Slice[];

export type Part = "s" | "a" | "t" | "b";

export type Inversion = 0 | 1 | 2 | 3;

export interface Permutation {
    altoInversion: Inversion;
    tenorInversion: Inversion;
    score: number;
}

export interface Time {
    bar: number;
    slice: number;
}

export const DICTIONARY_FULL: any = {
    COMMON_MAJOR: {
        null: ["I", "V", "IV", "ii", "vi", "iii"],

        "I": [Chord.all("iii7"), Chord.all("iii"), Chord.all("vi7"), Chord.all("vi"), Chord.all("ii7"), Chord.all("ii"), Chord.all("IV"), "viib", Chord.all("V"), Chord.all("I")],
        "Ib": ["IV", "ii", "V7d", "Vc", "vi", "Ic", "I"],
        "Ic": ["V7d", "V7", "V"],

        "ii": ["Ic", "V", "vi", "iii", "IV"],
        "iib": ["Ic", "V"],
        "iic": ["iiib"],

        "ii7": ["Ic", "V"],
        "ii7b": ["Ic", "V"],
        "ii7c": [],
        "ii7d": ["Vb"],

        "iii": ["vi", "IV", "ii", "vi"],
        "iiib": ["vi"],
        "iiic": [],

        "iii7": [],
        "iii7b": [],
        "iii7c": [],
        "iii7d": [],

        "IV": ["vii", "iii", "Ic", "I", "V", "ii"],
        "IVb": ["vii", "Ic", "I"],
        "IVc": [],

        "V": [Chord.all("iii"), "vi", Chord.all("ii"), "IV", Chord.all("I"), Chord.all("V")],
        "Vb": ["iiib", "iii", "vi", "I"],
        "Vc": ["Ib", "I"],

        "V7": ["vi", "I"],
        "V7b": ["iiib", "iii", "vi", "I"],
        "V7c": ["Ib", "I"],
        "V7d": ["iii", "Ib"],

        "vi": [Chord.all("ii7"), Chord.all("ii"), Chord.all("iii"), "Vb", "V", "IVb", "IV", "Ib"],
        "vib": ["ii"],
        "vic": [],

        "vi7": [Chord.all("ii7"), Chord.all("ii"), Chord.all("iii"), "Vb", "V", "IVb", "IV"],
        "vi7b": ["ii"],
        "vi7c": [],
        "vi7d": [],

        "vii": ["V/vi", "iii", "ii", "V"],
        "viib": ["V/vi", "iii"],
        "viic": [],

        "vii7": [],
        "vii7b": [],
        "vii7c": [],
        "vii7d": [],

        "viio7": [],
        "viio7b": [],
        "viio7c": [],
        "viio7d": []
    },
    COMMON_MINOR: {
        null: ["i", "iv", "V"],

        "i": ["VI", Chord.all("V7"), Chord.all("V"), "#viib"],
        "ib": ["i"],
        "ic": [],

        "bII": [],
        "bIIb": [],
        "bIIc": [],

        "ii": [],
        "iib": [],
        "iic": [],

        "ii7": [],
        "ii7b": [],
        "ii7c": [],
        "ii7d": [],

        "III": ["VI"],
        "IIIb": [],
        "IIIc": [],

        "iv": ["III", "iv"],
        "ivb": [],
        "ivc": [],

        "V": ["bIIb", "i"],
        "Vb": ["i"],
        "Vc": ["ib", "i"],

        "V7": ["i"],
        "V7b": ["i"],
        "V7c": ["ib", "i"],
        "V7d": ["ib"],

        "VI": [""],
        "VIb": [],
        "VIc": [],

        "VII": [],
        "VIIb": [],
        "VIIc": [],

        "#vii": [],
        "#viib": ["ib", "i"],
        "#viic": [],

        "#viio7": ["i"],
        "#viio7b": ["ib", "i"],
        "#viio7c": ["ib"],
        "#viio7d": ["ic"]
    },
    SPECIFIC_I: {
        null: [],

        "I": ["vii7/V"],
        "Ib": [],
        "Ic": [],

        "ii": [],
        "iib": [],
        "iic": [],

        "ii7": [],
        "ii7b": [],
        "ii7c": [],
        "ii7d": [],

        "iii": [],
        "iiib": [],
        "iiic": [],

        "iii7": [],
        "iii7b": [],
        "iii7c": [],
        "iii7d": [],

        "IV": [],
        "IVb": [],
        "IVc": [],

        "V": [Chord.all("V7c/V")],
        "Vb": [],
        "Vc": [],

        "V7": [],
        "V7b": [],
        "V7c": [],
        "V7d": [],

        "vi": [],
        "vib": [],
        "vic": [],

        "vi7": [],
        "vi7b": [],
        "vi7c": [],
        "vi7d": [],

        "vii": [],
        "viib": [],
        "viic": [],

        "vii7": [],
        "vii7b": [],
        "vii7c": [],
        "vii7d": [],

        "viio7": [],
        "viio7b": [],
        "viio7c": [],
        "viio7d": []
    },
    SPECIFIC_V: {
        "I": [],
        "Ib": [],
        "Ic": [],

        "ii": [],
        "iib": [],
        "iic": [],

        "ii7": [],
        "ii7b": [],
        "ii7c": [],
        "ii7d": [],

        "iii": [],
        "iiib": [],
        "iiic": [],

        "iii7": [],
        "iii7b": [],
        "iii7c": [],
        "iii7d": [],

        "IV": [],
        "IVb": [],
        "IVc": [],

        "V": [],
        "Vb": [],
        "Vc": [],

        "V7": [],
        "V7b": ["Ic/I", "V/I"],
        "V7c": ["Vb/I"],
        "V7d": [],

        "vi": [],
        "vib": [],
        "vic": [],

        "vi7": [],
        "vi7b": [],
        "vi7c": [],
        "vi7d": [],

        "vii": [],
        "viib": [],
        "viic": [],

        "vii7": ["Ic/I", "V/I"],
        "vii7b": [],
        "vii7c": [],
        "vii7d": [],

        "viio7": [],
        "viio7b": [],
        "viio7c": [],
        "viio7d": []
    }
}

export const DICTIONARY_PRIMARY_a_b: any = {
    COMMON_MAJOR: {
        null: ["I", "Ib", "IVb", "IV", "Vb", "V"],

        "I": ["IVb", "IV", "Vb", "V", "Ib", "I"],
        "Ib": ["IV", "V", "I"],

        "IV": ["V", "Ib", "I", "IVb"],
        "IVb": ["V", "I", "IV"],

        "V": ["I", "Ib", "IV", "Vb"],
        "Vb": ["I", "V"]
    }
}
