import fs from "fs";
import {
    Chord,
    Key,
    Numeral
} from "../dist/index.js";

const p = {
    init() {
        this.DICT = {
            COMMON: {
                MAJOR: {},
                MINOR: {}
            },
            SPECIFIC: {}
        }
    },

    register(string) {
        this.previous = this.chord;
        this.chord = Chord.parse(string);
        if (this.chord.getRelativeKey().string() === this.previous.getRelativeKey().string()) {
            const buffer = this.previous.getRelativeKey().getTonality() ? this.DICT.COMMON.MAJOR : this.DICT.COMMON.MINOR;
            const previous = this.previous.stringStem();
            if (buffer[previous] === undefined) {
                buffer[previous] = [];
            }
            const progression = this.chord.stringStem();
            if (!buffer[previous].includes(progression)) {
                buffer[previous].push(progression);
            }
        } else {
            const specific = this.DICT.SPECIFIC;
            const relativeKey = this.previous.getRelativeKey().string();
            if (specific[relativeKey] === undefined) {
                specific[relativeKey] = {};
            }
            const previous = this.previous.stringStem();
            if (specific[relativeKey][previous] === undefined) {
                specific[relativeKey][previous] = [];
            }
            const progression = this.chord.string();
            if (!specific[relativeKey][previous].includes(progression)) {
                specific[relativeKey][previous].push(progression);
            }
        }
    },

    load(keyString, symbols) {
        this.key = Key.parse(keyString);
        this.chord = new Chord(undefined, 0, 0, new Numeral(0, 0, this.key.getTonality()));
        this.relativeKey = this.key.getTonality() ? "/I" : "/i";

        symbols.split(" ").forEach(symbol => {
            if (symbol.startsWith("/")) {
                this.relativeKey = symbol;
            } else {
                this.register(symbol + this.relativeKey);
            }
        });
    }
}

p.init();
// BWV 1.6
p.load("F major", "I Vb I vi Ib IV I I IV viib Ib /V vii I iib V I /I I IV iiib ii7c vii I V V7 I Vb I V I Ib V Vb I Ib V Ib ii vi iib V I vi iii IV I viib Ib vi /V V7b /I V I");
// BWV 2.6
p.load("G minor", "V i #viib ib i Vb i V bIIb /v #viio7 /i V /v #viio7b /i V7b i V i i /v V i V ib Vc i ivb V i /III IV Ib vii7 I /i V ib iv V i i Vb i ivb /iv V7b /i iv i /v V7 ic V /i V");
// BWV 3.6
p.load("A major", "I I Ib IV vi /V V I V V7d Ib viib I V7c Ib ii7b Ic V I /I V I /vi Vb I /ii #viib /I ii Ib V vi Vb I V vi /V V7b /I V7 I");
// BWV 4.8
p.load("E minor", "i /v V ib Vc i V7b i V I /i V i /III Vb I /i V7c i ii7b V i i ivb iv i /III V I /i III I #viib /v IV Vb i V i /VII viib I IV IVb I /i i V7 VI III V7b i VI ii7b V I");
// BWV 5.7
p.load("G minor", "i iv #viib i iv V V7d ib #viib i iib V V i /III V7 Ib I ii7b V /i Vb V i /III Vb I vi ii7b V I I Vb I /i Vb i /VII V7b V7 I /III V7 I /i V7 VI iv V V7 I");
// BWV 6.6
p.load("G minor", "i i iib iv7 V ib #viib i iv7 V i i /III vi Vb V I /i i ivb iic ivb /III vi ii viib I Vb I V7 Ic V I /i V i #viib ib V VI iv7 V i");
// BWV 7.7
p.load("B minor", "iv iv III VI III i VI ii7b V i /v i iv VIb ib /iv ib #viib i V i i ivb iv VII /i VI ii7b V I /iv i ib /VI ii7 V7 I /i iv V i V i /III viib iii7 IV vii7c Ib /iv ii7d Vb i V i VI ic iv /VI viib I");

fs.writeFile("./tests/data/output.json", JSON.stringify(p.DICT), e => 0);