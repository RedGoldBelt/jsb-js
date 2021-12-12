import fs from "fs";
import {
    Chord,
    Key,
    Numeral
} from "../dist/index.js";

const p = {
    init() {
        this.dict = {
            start: {
                major: [],
                minor: []
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
        if (this.previous.base === undefined) {
            const buffer = this.dict.start[this.previous.getRelativeKey().getTonality() ? "major" : "minor"];
            const progression = this.chord.string();
            const datum = buffer.find(datum => datum[0] == progression);
            if (datum === undefined) {
                buffer.push([progression, 1])
            } else {
                ++datum[1];
            }
        }
        if (this.chord.getRelativeKey().string() === this.previous.getRelativeKey().string()) {
            const buffer = this.dict.common[this.previous.getRelativeKey().getTonality() ? "major" : "minor"];
            const previous = this.previous.stringStem();
            if (buffer[previous] === undefined) {
                buffer[previous] = [];
            }
            const progression = this.chord.stringStem();
            const datum = buffer[previous].find(datum => datum[0] == progression);
            if (datum === undefined) {
                buffer[previous].push([progression, 1]);
            } else {
                ++datum[1];
            }
        } else {
            const relativeKey = this.previous.getRelativeKey().string();
            let buffer = this.dict.specific;
            if (buffer[relativeKey] === undefined) {
                buffer[relativeKey] = {};
            }
            const previous = this.previous.stringStem();
            if (buffer[relativeKey][previous] === undefined) {
                buffer[relativeKey][previous] = [];
            }
            const progression = this.chord.string();
            const datum = buffer[relativeKey][previous].find(datum => datum[0] == progression);
            if (datum === undefined) {
                buffer[relativeKey][previous].push([progression, 1]);
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
        this.dict.start.major = this.dict.start.major.sort((l, r) => r[1] - l[1]).map(datum => datum[0]);
        this.dict.start.minor = this.dict.start.minor.sort((l, r) => r[1] - l[1]).map(datum => datum[0]);
        for (const array in this.dict.common.major) {
            this.dict.common.major[array] = this.dict.common.major[array].sort((l, r) => r[1] - l[1]).map(datum => datum[0]);
        }
        for (const array in this.dict.common.minor) {
            this.dict.common.minor[array] = this.dict.common.minor[array].sort((l, r) => r[1] - l[1]).map(datum => datum[0]);
        }
        for (const relativeKey in this.dict.specific) {
            for (const array in this.dict.specific[relativeKey]) {
                this.dict.specific[relativeKey][array] = this.dict.specific[relativeKey][array].sort((l, r) => r[1] - l[1]).map(datum => datum[0]);
            }
        }
    }
}

// TO DO: MAKE A VALIDATION METHOD WHICH CHECKS IF ALL EVENTS HAVE VALID DURATIONS, IF ALL CHORDS ARE POSSIBLE TO HARMONISE, ETC.
// TO DO: ADD OPTIONS: CONDONE DOUBLED THIRD FOR MAJOR/MINOR CHORDS, CONDONE MISSING FIFTH, CONDONE PARALLEL FIFTHS/OCTAVES, CONDONE AUGMENTED SECOND MELODIC INTERVAL,
// MAXIMUM JUMP IN SEMITONES, PART CROSSING, TESSITURA
// MAKE ALL PERMUTATIONS OF INVERSION POSSIBLE
// FLOWCHART!!!!!!!! //////////////////////////////////////////////////////////////

p.init();

// BWV 1.6 //
p.load(
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
    "/v iv V ib Vc i V7b i V I",
    "/i V i /III Vb I /i V7c i ii7b V i",
    "i i ivb iv #viio7c i /III Vb I",
    "/i III I #viib /v IV Vb i V i",
    "/VII viib I IV IVb I /i i V7 VI",
    "III V7b i VI ii7b V I"
);
// BWV 5.7
p.load(
    false,
    "/i i iv #viib i iv V", // A minor chord in G minor? Implement 'o' and '+' chord modifiers again and make iio/i and viio/I the norm?
    "V7d ib #viib i iib V",
    "V i /III V7 Ib I ii7b V /i Vb",
    "V i /III Vb I vi ii7b V I",
    "I Vb I /i Vb i /VII V7b V7 I",
    "/III V7 I /i V7 VI iv V V7 I"
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

fs.writeFile("./tests/data.json", JSON.stringify(p.dict), e => 0);