import fs from "fs";
import {
    Chord,
    Numeral
} from "../dist/index.js";

const p = {
    init() {
        this.dict = {
            start: {
                major: [],
                MINOR: []
            },
            common: {
                major: {},
                minor: {}
            },
            specific: {}
        }
    },

    register(string) {
        this.previous = this.chord;
        this.chord = Chord.parse(string);
        if (this.chord.getRelativeKey().string() === this.previous.getRelativeKey().string()) {
            const BUFFER = this.previous.getRelativeKey().getTonality() ? this.DICT.COMMON.MAJOR : this.DICT.COMMON.MINOR;
            const previous = this.previous.stringStem();
            if (BUFFER[previous] === undefined) {
                BUFFER[previous] = [];
            }
            const progression = this.chord.stringStem();
            const datum = BUFFER[previous].find(datum => datum[0] == progression);
            if (datum === undefined) {
                BUFFER[previous].push([progression, 1]);
            } else {
                ++datum[1];
            }
        } else {
            const relativeKey = this.previous.getRelativeKey().string();
            let BUFFER = this.DICT.SPECIFIC;
            if (BUFFER[relativeKey] === undefined) {
                BUFFER[relativeKey] = {};
            }
            const previous = this.previous.stringStem();
            if (BUFFER[relativeKey][previous] === undefined) {
                BUFFER[relativeKey][previous] = [];
            }
            const progression = this.chord.string();
            const datum = BUFFER[relativeKey][previous].find(datum => datum[0] == progression);
            if (datum === undefined) {
                BUFFER[relativeKey][previous].push([progression, 1]);
            } else {
                ++datum[1];
            }
        }
    },

    load(tonality, ...arr) {
        this.chord = new Chord(undefined, 0, 0, new Numeral(0, 0, tonality));

        arr.forEach(symbols => symbols.split(" ").forEach(symbol => {
            if (symbol.startsWith("/")) {
                this.relativeKey = symbol;
            } else {
                this.register(symbol + this.relativeKey);
            }
        }));
    },

    sort() {
        for (const array in this.DICT.COMMON.MAJOR) {
            this.DICT.COMMON.MAJOR[array] = this.DICT.COMMON.MAJOR[array].sort((l, r) => r[1] - l[1]).map(datum => datum[0]);
        }
        for (const array in this.DICT.COMMON.MINOR) {
            this.DICT.COMMON.MINOR[array] = this.DICT.COMMON.MINOR[array].sort((l, r) => r[1] - l[1]).map(datum => datum[0]);
        }
        for (const relativeKey in this.DICT.SPECIFIC) {
            for (const array in this.DICT.SPECIFIC[relativeKey]) {
                this.DICT.SPECIFIC[relativeKey][array] = this.DICT.SPECIFIC[relativeKey][array].sort((l, r) => r[1] - l[1]).map(datum => datum[0]);
            }
        }
    }
}

p.init();

// BWV 1.6
p.load(
    true,
    "/I I Vb I vi Ib IV IVb I",
    "I IV viib Ib /V V7b I ii7b V I",
    "/I I IV iiib IV7b V7b I V Ic V7 I",
    "Vb I",
    "V I",
    "I Ib V Vb I Ib V Ib ii vi iib V I",
    "vi iii IV I viib Ib /V ii V7b I /I I"
);
// BWV 2.6
p.load(
    false,
    "/i V i #viib ib i Vb i V",
    "bIIb /v #viio7 I #viio7b /i V7b i V i",
    "i /v Vb i V ib Vc i ivb V",
    "/III iii IV Ib /VII vii7 I /i ii7c V ib iv V i",
    "i Vb i /iv ib V7b i /v iv V7 ic V I"
);
// BWV 3.6
p.load(
    true,
    "/I I I Ib IV /V ii V I V",
    "V Ib viib I V7c Ib ii7b Ic V I",
    "/I V I /vi Vb I /ii #viib i /I Ib V",
    "/V ii Ib IV vii7c I ii V7b /I V7 I"
);
// BWV 4.8
p.load(
    false,
    "/i i /v V ib Vc i V7b i V I", // First chord considered in i or v?
    "/i V i /III Vb I /i V7c i ii7b V i i ivb iv i /III V I /i III I #viib /v IV Vb i V i /VII viib I IV IVb I /i i V7 VI III V7b i VI ii7b V I"
);
// BWV 5.7
p.load(
    false,
    "/i i iv #viib i iv V V7d ib #viib i iib V V i /III V7 Ib I ii7b V /i Vb V i /III Vb I vi ii7b V I I Vb I /i Vb i /VII V7b V7 I /III V7 I /i V7 VI iv V V7 I"
);
// BWV 6.6
p.load(
    false,
    "/i i i iib iv7 V ib #viib i iv7 V i i /III vi Vb V I /i i ivb iic ivb /III vi ii viib I Vb I V7 Ic V I /i V i #viib ib V VI iv7 V i"
);
// BWV 7.7
p.load(
    false,
    "/i iv iv III VI III i VI ii7b V i /v i iv VIb ib /iv ib #viib i V i i ivb iv VII /i VI ii7b V I /iv i ib /VI ii7 V7 I /i iv V i V i /III viib iii7 IV vii7c Ib /iv ii7d Vb i V i VI ic iv /VI viib I"
);

p.sort();

fs.writeFile("./tests/output.json", JSON.stringify(p.DICT), e => 0);