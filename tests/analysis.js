import fs from "fs";
import { Chord, Numeral } from "../dist/index.js";

const $ = {
    init() {
        this.dict = {
            start: { major: [], minor: [] },
            common: { major: {}, minor: {} },
            specific: {}
        }
    },

    register(string) {
        this.previous = this.chord;
        this.chord = Chord.parse(string);
        if (this.previous.base === undefined) {
            const buffer = this.dict.start[this.previous.relativeKey.tonality ? "major" : "minor"];
            const progression = this.chord.string();
            const datum = buffer.find(datum => datum.value === progression);
            if (datum) {
                ++datum.frequency;
            } else {
                buffer.push({ value: progression, frequency: 1 });
            }
            return;
        }
        const relativeKey = this.previous.relativeKey.string();
        if (this.chord.relativeKey.string() === relativeKey) {
            const buffer = this.dict.common[this.previous.relativeKey.tonality ? "major" : "minor"];
            const previous = this.previous.stringStem();
            if (buffer[previous] === undefined) {
                buffer[previous] = [];
            }
            const progression = this.chord.stringStem();
            const datum = buffer[previous].find(datum => datum.value === progression);
            if (datum === undefined) {
                buffer[previous].push({ value: progression, frequency: 1 });
            } else {
                ++datum.frequency;
            }
        } else {
            const buffer = this.dict.specific;
            if (buffer[relativeKey] === undefined) {
                buffer[relativeKey] = {};
            }
            const previous = this.previous.stringStem();
            if (buffer[relativeKey][previous] === undefined) {
                buffer[relativeKey][previous] = [];
            }
            const progression = this.chord.string();
            const datum = buffer[relativeKey][previous].find(datum => datum.value === progression);
            if (datum === undefined) {
                buffer[relativeKey][previous].push({ value: progression, frequency: 1 });
            } else {
                ++datum.frequency;
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
        this.dict.start.major = this.dict.start.major.sort((l, r) => r.frequency - l.frequency).map(datum => datum.value);
        this.dict.start.minor = this.dict.start.minor.sort((l, r) => r.frequency - l.frequency).map(datum => datum.value);
        for (const array in this.dict.common.major) {
            this.dict.common.major[array] = this.dict.common.major[array].sort((l, r) => r.frequency - l.frequency).map(datum => datum.value);
        }
        for (const array in this.dict.common.minor) {
            this.dict.common.minor[array] = this.dict.common.minor[array].sort((l, r) => r.frequency - l.frequency).map(datum => datum.value);
        }
        for (const relativeKey in this.dict.specific) {
            for (const array in this.dict.specific[relativeKey]) {
                this.dict.specific[relativeKey][array] = this.dict.specific[relativeKey][array].sort((l, r) => r.frequency - l.frequency).map(datum => datum.value);
            }
        }
    }
}

$.init();

// BWV 1.6
$.load(
    true,
    "/I I Vb I vi Ib IV IVb I",
    "I IV viib Ib /V V7b I ii7b V I",
    "/I I IV ii7b iiib IV7b V7b I V Ic V7 I",
    "Vb I",
    "V I",
    "I Ib I V Vb V I Ib I V Ib ii vi iib V I",
    "vi iii IV I viib iii7 vi /V V7b I /I I"
);
// BWV 2.6
$.load(
    false,
    "/i V i #viib ib i Vb i V",
    "bIIb /v #viio7 I #viio7b /i V7b i V i",
    "/v iv Vb i V ib i ivb V",
    "/III iii IV Ib V /i ii7c V ib iv V i",
    "i Vb i /iv ib V7b i /v iv V7 ic V I"
);
// BWV 3.6
$.load(
    true,
    "/I I I Ib IV vi /V V I V",
    "V Ib viib I V7c Ib ii7b Ic V I",
    "/I V I /vi Vb I /ii #viib i /I Ib V",
    "/I vi Vb I /V vii7c /I V vi /V V7b /I V7 I"
);
// BWV 4.8
$.load(
    false,
    "/v iv V ib Vc i V7b i V I",
    "/i V i /III Vb I /i V7c i ii7b V i",
    "i i ivb iv #viio7c i /III Vb I",
    "/i III I #viib /v IV Vb i V i",
    "/VII viib I IV IVb I /i i V7 VI",
    "III V7b i VI ii7b V I"
);
// BWV 5.7
$.load(
    false,
    "/i i iv #viib i iv V",
    "V7d ib #viib i iib V",
    "V i /III V7 Ib I ii7b V /i Vb",
    "V i /III Vb I vi ii7b V I",
    "I Vb I /i Vb i /VII V7b V7 I",
    "/III V I /i V7 VI iv V V7 I"
);
// BWV 6.6
$.load(
    false,
    "/i i i iib V ib #viib i iv7 V i",
    "/III vi Vb V I /i i ivb iic ivb V",
    "/III vi ii viib I Vb I V7 Ic V I /i V i #viib ib V VI iv7 V i"
);
// BWV 7.7
$.load(
    false,
    "/i iv iv III VI III i VI ii7b V i /v i iv VIb ib /iv ib #viib i V i i ivb iv VII /i VI ii7b V I /iv i ib /VI ii7 V7 I /i iv V i V i /III viib iii7 IV vii7c Ib /iv ii7d Vb i V i VI ic iv /VI viib I"
);

$.sort();

fs.writeFile("./tests/data.json", JSON.stringify($.dict), () => void 0);