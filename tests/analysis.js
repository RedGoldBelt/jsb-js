import fs from 'fs';
import { Chord, Symbol } from '../dist/index.js';

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
            const buffer = this.dict.start[this.previous.relativeKey.tonality ? 'major' : 'minor'];
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
            const buffer = this.dict.common[this.previous.relativeKey.tonality ? 'major' : 'minor'];
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
        this.chord = new Chord(undefined, 0, 0, new Symbol(0, 0, tonality));

        arr.forEach(symbols => symbols.split(' ').forEach(symbol => {
            if (symbol.startsWith('/')) {
                this.relativeKey = symbol;
            } else {
                this.register(symbol + this.relativeKey);
            }
        }));
    },

    process(data) {
        return data.sort((l, r) => l.frequency - r.frequency).map(datum => datum.value)
    },

    sort() {
        this.dict.start.major = $.process(this.dict.start.major);
        this.dict.start.minor = $.process(this.dict.start.minor);
        for (const array in this.dict.common.major) {
            this.dict.common.major[array] = $.process(this.dict.common.major[array]);
        }
        for (const array in this.dict.common.minor) {
            this.dict.common.minor[array] = $.process(this.dict.common.minor[array]);
        }
        for (const relativeKey in this.dict.specific) {
            for (const array in this.dict.specific[relativeKey]) {
                this.dict.specific[relativeKey][array] = $.process(this.dict.specific[relativeKey][array]);
            }
        }
    }
}

$.init();

// BWV 1.6
$.load(
    true,
    '/I I Vb I vi Ib IV IVb I',
    'I IV viib Ib /V V7b I ii7b V I',
    '/I I IV ii7b iiib IV7b V7b I V V7 I',
    'Vb I',
    'V I',
    'I Ib I V Vb V I Ib I V Ib ii vi iib V I',
    'vi iii IV I viib iii7 vi /V V7b /I V I'
);
// BWV 2.6
$.load(
    false,
    '/i V i #viib ib i Vb i V',
    'bIIb /v #viio7 /i V /v #viio7b /i V7b i V i',
    '/v iv Vb i V ib i ivb V',
    '/III iii IV Ib V /i ii7c V ib iv V i',
    'i Vb i /iv ib V7b i /v iv V I'
);
// BWV 3.6
$.load(
    true,
    '/I I I Ib IV vi /V V I V',
    'V Ib viib I V7c Ib ii7b Ic V I',
    '/I V I /vi Vb i /ii #viib i /I Ib V',
    '/I vi Vb I V vi /V V7b /I V7 I'
);
// BWV 4.8
$.load(
    false,
    '/v iv V ib Vc i V7b i V I',
    '/i V i /III Vb I /i V7c i ii7b V i',
    'i i ivb iv #viio7c i /III Vb I',
    '/i III I #viib /v IV Vb i V i',
    '/VII viib I IV IVb I /i i V7 VI',
    'III V7b i VI ii7b V I'
);
// BWV 5.7
$.load(
    false,
    '/i i iv #viib i iv V',
    'V7d ib #viib i iib V',
    'V i /III V7 Ib I ii7b V /i Vb',
    'V i /III Vb I vi ii7b V I',
    'I Vb I /i Vb i /VII V7b V7 I',
    '/III V I /i V7 VI iv V V7 I'
);
// BWV 6.6
$.load(
    false,
    '/i i i iib V ib #viib i iv7 V i',
    '/III vi Vb V I /i i ivb ivb V',
    '/III vi ii I Vb I V7 V7 I',
    '/i V i #viib ib V VI V i'
);
// BWV 7.7
$.load(
    false,
    '/VI vi vi V I V /i i VI ii7b V i',
    '/v i iv ib /iv ib #viib i V i',
    '/VI vi iib ii V I /i ii7b V I',
    '/iv i ib /VI ii7 V7 I /i iv V7 i',
    'V i /III viib IV Ib /iv Vb i V',
    '/VI vi IV viib I /iv IIb ivb V i',
    '/VII V I /III Vc I /i iv V7 VI V I'
);
// BWV 8.6
$.load(
    true,
    '/I I I IV I ii Vb I V',
    'Vb I /V iib V7d Ib I V V I',
    '/vi VII iv i ib ii7b ib iib V',
    '/V iib V7d Ib V V I',
    '/I V I /vi i V /iii #viio7 /vi V i',
    '/IV iii V7b I Ib /I Ib V I viio7c V7d /V viio7 /I V I'
);
// BWV 9.7 Modulates from E major to D major
// BWV 10.7
$.load(
    false,
    '/III vi Vb I /i V7c i Vb VIb /III V7b I vi ii7b V I',
    'I Ib V Vb /i iv ivb ic V i',
    '/III vi V I Ib /i V ic /III viib I Ib ii7b V I',
    'I Ib V Vb /i IV #viic ib v iic /iv V7d ib V7c i ib /i iv I'
)

$.sort();

fs.writeFile('./tests/data.json', JSON.stringify($.dict), () => null);