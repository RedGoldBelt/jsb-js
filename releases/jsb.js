/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 590:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* unused harmony export default */
/* harmony import */ var _key_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(799);
/* harmony import */ var _numeral_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(345);
/* harmony import */ var _resolution_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(93);



class Chord {
    constructor(base, alteration, inversion, relativeKey) {
        this.base = base;
        this.alteration = alteration;
        this.inversion = inversion;
        this.relativeKey = relativeKey;
    }
    static parse(string) {
        const result = string.match(/^((b|#|)(III|iii|VII|vii|II|ii|IV|iv|VI|vi|I|i|V|v))(o7|7|)([a-d])?(\/((b|#|)(III|iii|VII|vii|II|ii|IV|iv|VI|vi|I|i|V|v)))?$/);
        if (result === null) {
            throw `Could not parse chord '${string}'`;
        }
        return new Chord(_numeral_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"].parse */ .Z.parse(result[1]), result[4], (result[5] ? Chord.INVERSIONS.indexOf(result[5]) : 0), result[6] ? _numeral_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"].parse */ .Z.parse(result[7]) : _numeral_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"].parse */ .Z.parse("I"));
    }
    resolve(key) {
        if (this.base === null) {
            throw "Cannot resolve chord with base 'null'";
        }
        if (this.relativeKey) {
            key = new _key_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z(key.degree(this.relativeKey.getDegree()), this.relativeKey.getTonality());
        }
        const rootPitch = key.degree(this.base.getDegree()).alterAccidental(this.base.getAccidental()).semitones() - key.degree(0).semitones();
        const third = key.degree(this.base.getDegree() + 2, rootPitch + (this.base.getTonality() ? 4 : 3));
        let fifth;
        let seventh;
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
        return new _resolution_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z(key.degree(this.base.getDegree()).alterAccidental(this.base.getAccidental()), third, fifth, seventh, this.inversion);
    }
    progression(dictionary) {
        var _a, _b;
        const SPECIFIC = (_a = dictionary.SPECIFIC) === null || _a === void 0 ? void 0 : _a[this.relativeKey.string()][this.toStringStem()];
        const SPECIFIC_OPTIONS = SPECIFIC === null || SPECIFIC === void 0 ? void 0 : SPECIFIC.map(Chord.parse);
        const COMMON = (this.relativeKey.getTonality() ? dictionary.COMMON.MAJOR : dictionary.COMMON.MINOR)[this.toStringStem()];
        const COMMON_OPTIONS = COMMON.map(string => {
            const chord = Chord.parse(string);
            chord.relativeKey = this.relativeKey;
            return chord;
        });
        return (_b = SPECIFIC_OPTIONS === null || SPECIFIC_OPTIONS === void 0 ? void 0 : SPECIFIC_OPTIONS.concat(COMMON_OPTIONS)) !== null && _b !== void 0 ? _b : COMMON_OPTIONS;
    }
    getInversion() {
        return this.inversion;
    }
    setInversion(inversion) {
        this.inversion = inversion;
        return this;
    }
    toStringStem() {
        return this.base ? this.base.string() + this.alteration + (this.inversion ? Chord.INVERSIONS[this.inversion] : "") : "start";
    }
    string() {
        let string = this.toStringStem();
        if (!(this.relativeKey.getDegree() === 0 && this.relativeKey.getAccidental() === 0)) {
            string += "/" + this.relativeKey.string();
        }
        return string;
    }
}
Chord.INVERSIONS = ["a", "b", "c", "d"];


/***/ }),

/***/ 781:
/***/ (() => {

var Dict;
(function (Dict) {
    Dict.FULL = {
        COMMON: {
            MAJOR: {
                start: ["I", "V", "IV", "ii", "vi", "iii"],
                "I": [
                    "viib",
                    "iiic", "iiib", "iii",
                    "vic", "vib", "vi",
                    "ii7d", "ii7c", "ii7b", "ii7", "iic", "iib", "ii",
                    "IVc", "IVb", "IV",
                    "V7d", "V7c", "V7b", "V7", "Vc", "Vb", "V",
                    "Ic", "Ib", "I"
                ],
                "Ib": [
                    "IV",
                    "ii7b", "ii7", "iib", "ii",
                    "V7d", "V7c", "Vc",
                    "vi",
                    "Ic", "I"
                ],
                "Ic": [
                    "V7", "V"
                ],
                "ii": ["Ic", "V", "vi", "iii", "IV"],
                "iib": ["Ic", "V"],
                "iic": ["iiib"],
                "ii7": ["Ic", "V"],
                "ii7b": ["Ic", "V"],
                "ii7c": [],
                "ii7d": ["Vb"],
                "iii": ["viib", "vi", "IV", "ii", "vi"],
                "iiib": ["vi"],
                "iiic": [],
                "IV": ["vi", "vii", "iii", "Ic", "I", "V", "ii"],
                "IVb": ["vii", "Ic", "I"],
                "IVc": [],
                "V": [
                    "iiic", "iiib", "iii",
                    "vi",
                    "iic", "iib", "ii",
                    "IV",
                    "Ic", "Ib", "I",
                    "Vb"
                ],
                "Vb": ["vi", "I"],
                "Vc": ["Ib", "I"],
                "V7": ["vi", "I"],
                "V7b": ["iiib", "iii", "vi", "I"],
                "V7c": ["Ib", "I"],
                "V7d": ["iii", "Ib"],
                "vi": [
                    "ii7d", "ii7c", "ii7b", "ii7", "iic", "iib", "ii",
                    "iiic", "iiib", "iii",
                    "Vb",
                    "V",
                    "IVb", "IV",
                    "Ib"
                ],
                "vib": ["ii"],
                "vic": [],
                "vii": ["V/vi", "iii", "ii", "V"],
                "viib": ["V/vi", "I", "iii"],
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
            MINOR: {
                start: ["i", "iv", "V"],
                "i": [
                    "VI",
                    "V7d", "V7c", "V7b", "V7", "Vc", "Vb", "V",
                    "#viib"
                ],
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
                "VI": [],
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
            }
        },
        SPECIFIC: {
            I: {
                start: [],
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
                "IV": [],
                "IVb": [],
                "IVc": [],
                "V": ["vii/V", "V7d/V", "V7c/V", "V7b/V", "V7/V"],
                "Vb": [],
                "Vc": [],
                "V7": [],
                "V7b": [],
                "V7c": [],
                "V7d": [],
                "vi": ["Vb/V"],
                "vib": [],
                "vic": [],
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
            II: {},
            III: {},
            IV: {
                start: ["I", "V", "IV", "ii", "vi", "iii"],
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
                "IV": [],
                "IVb": [],
                "IVc": [],
                "V": [],
                "Vb": [],
                "Vc": [],
                "V7": [],
                "V7b": [],
                "V7c": [],
                "V7d": [],
                "vi": [],
                "vib": [],
                "vic": [],
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
            V: {
                "I": ["V/I"],
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
            },
            VI: {},
            VII: {},
            i: {},
            ii: {},
            iii: {},
            iv: {},
            v: {},
            vi: {},
            vii: {}
        }
    };
    Dict.PRIMARY_A = {
        COMMON: {
            MAJOR: {
                start: [
                    "I",
                    "IV",
                    "V"
                ],
                "I": [
                    "IV",
                    "V",
                    "I"
                ],
                "IV": [
                    "V",
                    "I",
                    "IV"
                ],
                "V": [
                    "I",
                    "IV",
                    "V"
                ]
            },
            MINOR: {
                start: ["i",
                    "iv",
                    "V"],
                "i": [
                    "iv",
                    "V",
                    "i"
                ],
                "iv": [
                    "V",
                    "i",
                    "iv"
                ],
                "V": [
                    "i",
                    "iv",
                    "V"
                ]
            }
        }
    };
    Dict.PRIMARY_AB = {
        COMMON: {
            MAJOR: {
                start: [
                    "I", "Ib",
                    "IVb", "IV",
                    "V", "Vb"
                ],
                "I": [
                    "IVb", "IV",
                    "Vb", "V",
                    "Ib", "I"
                ],
                "Ib": [
                    "IV", "IVb",
                    "V", "Vb",
                    "I", "Ib"
                ],
                "IV": [
                    "Vb", "V",
                    "Ib", "I",
                    "IVb", "IV"
                ],
                "IVb": [
                    "V", "Vb",
                    "I", "Ib",
                    "IV", "IVb"
                ],
                "V": [
                    "Ib", "I",
                    "IVb", "IV",
                    "Vb", "V"
                ],
                "Vb": [
                    "I", "Ib",
                    "IV", "IVb",
                    "V", "Vb"
                ]
            },
            MINOR: {
                start: [
                    "i", "ib",
                    "ivb", "iv",
                    "V", "Vb"
                ],
                "i": [
                    "ivb", "iv",
                    "Vb", "V",
                    "ib", "i"
                ],
                "ib": [
                    "iv", "ivb",
                    "V", "Vb",
                    "i", "ib"
                ],
                "iv": [
                    "Vb", "V",
                    "ib", "i",
                    "ivb", "iv"
                ],
                "ivb": [
                    "V", "Vb",
                    "i", "ib",
                    "iv", "ivb"
                ],
                "V": [
                    "ib", "i",
                    "ivb", "iv",
                    "Vb", "V"
                ],
                "Vb": [
                    "i", "ib",
                    "iv", "ivb",
                    "V", "Vb"
                ]
            }
        }
    };
    Dict.PRIMARY_ABC = {
        COMMON: {
            MAJOR: {
                start: [
                    "I", "Ib", "Ic",
                    "IVc", "IVb", "IV",
                    "V", "Vb", "Vc"
                ],
                "I": [
                    "IVb", "IV",
                    "Vb", "V",
                    "Ib", "I"
                ],
                "Ib": [
                    "IV", "IVb",
                    "V", "Vb",
                    "I", "Ib"
                ],
                "IV": [
                    "Vb", "V",
                    "Ib", "I",
                    "IVb", "IV"
                ],
                "IVb": [
                    "V", "Vb",
                    "I", "Ib",
                    "IV", "IVb"
                ],
                "V": [
                    "Ib", "I",
                    "IVb", "IV",
                    "Vb", "V"
                ],
                "Vb": [
                    "I", "Ib",
                    "IV", "IVb",
                    "V", "Vb"
                ],
                "Vc": []
            },
            MINOR: {
                start: [
                    "i", "ib",
                    "ivb", "iv",
                    "V", "Vb"
                ],
                "i": [
                    "ivb", "iv",
                    "Vb", "V",
                    "ib", "i"
                ],
                "ib": [
                    "iv", "ivb",
                    "V", "Vb",
                    "i", "ib"
                ],
                "iv": [
                    "Vb", "V",
                    "ib", "i",
                    "ivb", "iv"
                ],
                "ivb": [
                    "V", "Vb",
                    "i", "ib",
                    "iv", "ivb"
                ],
                "V": [
                    "ib", "i",
                    "ivb", "iv",
                    "Vb", "V"
                ],
                "Vb": [
                    "i", "ib",
                    "iv", "ivb",
                    "V", "Vb"
                ]
            }
        }
    };
})(Dict || (Dict = {}));
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ((/* unused pure expression or super */ null && (Dict)));


/***/ }),

/***/ 790:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* unused harmony export default */
class Event {
    constructor(s, a, t, b, cadence) {
        this.map = 0;
        this.s = s;
        this.a = a;
        this.t = t;
        this.b = b;
        this.cadence = cadence;
    }
    getS() {
        return this.s;
    }
    setS(s) {
        this.s = s;
        return this;
    }
    getA() {
        return this.a;
    }
    setA(a) {
        this.a = a;
        return this;
    }
    getT() {
        return this.t;
    }
    setT(t) {
        this.t = t;
        return this;
    }
    getB() {
        return this.b;
    }
    setB(b) {
        this.b = b;
        return this;
    }
    getPart(part) {
        switch (part) {
            case "s": return this.getS();
            case "a": return this.getA();
            case "t": return this.getT();
            case "b": return this.getB();
        }
    }
    setPart(part, group) {
        switch (part) {
            case "s": return this.setS(group);
            case "a": return this.setA(group);
            case "t": return this.setT(group);
            case "b": return this.setB(group);
        }
    }
    duration() {
        var _a, _b, _c, _d;
        return (_d = (_c = (_b = (_a = this.getS().duration()) !== null && _a !== void 0 ? _a : this.getA().duration) !== null && _b !== void 0 ? _b : this.getT().duration) !== null && _c !== void 0 ? _c : this.getB().duration) !== null && _d !== void 0 ? _d : 0;
    }
    getChord() {
        return this.chord;
    }
    setChord(chord) {
        this.chord = chord;
        return this;
    }
    isCadence() {
        return this.cadence;
    }
}


/***/ }),

/***/ 892:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ Group)
/* harmony export */ });
/* harmony import */ var _note_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(472);

class Group {
    constructor(notes, index) {
        this.notes = notes;
        this.index = index;
    }
    static parse(string) {
        if (string.startsWith("(") && string.endsWith(")")) {
            const array = string.slice(1, -1).split(",").map(string => _note_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"].parse */ .Z.parse(string));
            return new Group(array, 0);
        }
        return new Group([_note_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"].parse */ .Z.parse(string)], 0);
    }
    static empty() {
        return new Group([], 0);
    }
    main() {
        return this.getNotes()[this.getIndex()];
    }
    at(index) {
        if (index < 0) {
            index = this.getNotes().length + index;
        }
        return this.getNotes()[index];
    }
    duration() {
        return this.getNotes().map(note => note.getDuration()).reduce((l, r) => l + r);
    }
    getNotes() {
        return this.notes;
    }
    setNotes(notes) {
        this.notes = notes;
        return this;
    }
    getIndex() {
        return this.index;
    }
    setIndex(index) {
        this.index = index;
        return this;
    }
    string() {
        return this.getNotes().map(note => note.string()).join(" ");
    }
}


/***/ }),

/***/ 850:
/***/ ((__unused_webpack___webpack_module__, __unused_webpack___webpack_exports__, __webpack_require__) => {

/* harmony import */ var _chord_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(590);
/* harmony import */ var _dictionary_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(781);
/* harmony import */ var _group_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(892);
/* harmony import */ var _key_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(799);
/* harmony import */ var _note_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(472);
/* harmony import */ var _numeral_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(345);
/* harmony import */ var _piece_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(423);
/* harmony import */ var _pitch_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(411);
/* harmony import */ var _tone_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(237);
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(740);















/***/ }),

/***/ 799:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ Key)
/* harmony export */ });
/* harmony import */ var _tone_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(237);

class Key {
    constructor(tone, tonality) {
        this.tone = tone;
        this.tonality = tonality;
    }
    static parse(string) {
        const result = string.match(/^(C|D|E|F|G|A|B)(bb|x|b|#|) (major|minor)$/);
        if (result === null) {
            throw `Could not parse key '${string}'`;
        }
        return new Key(_tone_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"].parse */ .Z.parse(result[1] + result[2]), result[3] === "major");
    }
    degree(degree, relativePitch) {
        degree %= 7;
        relativePitch !== null && relativePitch !== void 0 ? relativePitch : (relativePitch = (this.getTonality() ? [0, 2, 4, 5, 7, 9, 11] : [0, 2, 3, 5, 7, 8, 10])[degree]);
        const top = new _tone_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z((this.getTone().getLetter() + degree) % 7, 0);
        top.setAccidental((relativePitch - top.semitones() + this.getTone().semitones() + 18) % 12 - 6);
        return top;
    }
    accidentals() {
        let accidentals = (2 * this.getTone().getLetter()) % 7 + 7 * this.getTone().getAccidental();
        if (this.getTone().getLetter() === 3) {
            accidentals -= 7;
        }
        if (!this.tonality) {
            accidentals -= 3;
        }
        return accidentals;
    }
    signature() {
        const accidentals = this.accidentals();
        return [
            Math.floor((accidentals + 5) / 7),
            Math.floor((accidentals + 3) / 7),
            Math.floor((accidentals + 1) / 7),
            Math.floor((accidentals + 6) / 7),
            Math.floor((accidentals + 4) / 7),
            Math.floor((accidentals + 2) / 7),
            Math.floor(accidentals / 7)
        ];
    }
    getTone() {
        return this.tone;
    }
    setTone(tone) {
        this.tone = tone;
        return this;
    }
    getTonality() {
        return this.tonality;
    }
    setTonality(tonality) {
        this.tonality = tonality;
        return this;
    }
    string() {
        return this.getTone().string() + " " + (this.getTonality() ? "major" : "minor");
    }
}


/***/ }),

/***/ 472:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ Note)
/* harmony export */ });
/* harmony import */ var _pitch_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(411);

class Note {
    constructor(pitch, duration) {
        this.pitch = pitch;
        this.duration = duration;
    }
    static parse(string) {
        const result = string.match(/^([A-G](bb|b|#|x|)[1-6])(_*)(\/*)(\.*)$/);
        if (result === null) {
            throw `Could not parse note '${string}'`;
        }
        return new Note(_pitch_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"].parse */ .Z.parse(result[1]), 2 ** (result[3].length - result[4].length) * 1.5 ** result[5].length);
    }
    getPitch() {
        return this.pitch;
    }
    setPitch(pitch) {
        this.pitch = pitch;
        return this;
    }
    getDuration() {
        return this.duration;
    }
    setDuration(duration) {
        this.duration = duration;
        return this;
    }
    string() {
        let string = this.getPitch().string();
        switch (this.getDuration()) {
            case 0.25:
                string += "𝅘𝅥𝅯";
                break;
            case 0.5:
                string += "♪";
                break;
            case 0.75:
                string += "♪.";
                break;
            case 1:
                string += "♩";
                break;
            case 1.5:
                string += "♩.";
                break;
            case 2:
                string += "𝅗𝅥";
                break;
            case 3:
                string += "𝅗𝅥.";
                break;
            case 4:
                string += "𝅝";
                break;
            case 6:
                string += "𝅝.";
                break;
        }
        return string;
    }
}


/***/ }),

/***/ 345:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ Numeral)
/* harmony export */ });
/* harmony import */ var _tone_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(237);

class Numeral {
    constructor(accidental, degree, tonality) {
        this.accidental = accidental;
        this.degree = degree;
        this.tonality = tonality;
    }
    static parse(string) {
        const result = string.match(/^(b|#|)(III|iii|VII|vii|II|ii|IV|iv|VI|vi|I|i|V|v)$/);
        if (result === null) {
            throw `Could not parse numeral '${string}'`;
        }
        return new Numeral(_tone_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"].ACCIDENTALS.indexOf */ .Z.ACCIDENTALS.indexOf(result[1]), Numeral.NUMERALS.indexOf(result[2].toLowerCase()), result[2] === result[2].toUpperCase());
    }
    getAccidental() {
        return this.accidental;
    }
    setAccidental(accidental) {
        this.accidental = accidental;
        return this;
    }
    getDegree() {
        return this.degree;
    }
    setDegree(degree) {
        this.degree = degree;
        return this;
    }
    getTonality() {
        return this.tonality;
    }
    setTonality(tonality) {
        this.tonality = tonality;
        return this;
    }
    string() {
        return _tone_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"].ACCIDENTALS */ .Z.ACCIDENTALS[this.accidental] + Numeral.NUMERALS[this.degree][this.tonality ? "toUpperCase" : "toLowerCase"]();
    }
}
Numeral.NUMERALS = ["i", "ii", "iii", "iv", "v", "vi", "vii"];


/***/ }),

/***/ 423:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* unused harmony export default */
/* harmony import */ var _chord_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(590);
/* harmony import */ var _dictionary_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(781);
/* harmony import */ var _group_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(892);
/* harmony import */ var _key_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(799);
/* harmony import */ var _numeral_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(345);
/* harmony import */ var _pitch_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(411);







class Piece {
    constructor() {
        this.input = [];
        this.output = [];
        this.time = { bar: 0, event: 0 };
        this.maxTime = { bar: 0, event: 0 };
        this.key = Key.parse("C major");
        this.dictionary = Dict.FULL;
    }
    parse(string, part) {
        var _a, _b;
        var _c, _d;
        const split = string.split(/[[|\]]/).filter(bar => bar !== "").map(bar => bar.split(" ").filter(group => group !== ""));
        for (let bar = 0; bar < split.length; ++bar) {
            (_a = (_c = this.getInput())[bar]) !== null && _a !== void 0 ? _a : (_c[bar] = []);
            for (let event = 0; event < split[bar].length; ++event) {
                const cadence = split[bar][event].endsWith("@");
                if (cadence) {
                    split[bar][event] = split[bar][event].slice(0, -1);
                }
                (_b = (_d = this.getInput()[bar])[event]) !== null && _b !== void 0 ? _b : (_d[event] = new Event(Group.empty(), Group.empty(), Group.empty(), Group.empty(), cadence));
                this.getInput()[bar][event][part] = Group.parse(split[bar][event]);
            }
        }
        return this;
    }
    previousPreviousOutputEvent() {
        let { bar, event } = this.time;
        if (--event < 0) {
            if (--bar < 0) {
                return undefined;
            }
            event = this.getOutput()[bar].length - 1;
        }
        if (--event < 0) {
            if (--bar < 0) {
                return undefined;
            }
            event = this.getOutput()[bar].length - 1;
        }
        return this.getOutput()[bar][event];
    }
    previousOutputEvent() {
        let { bar, event } = this.time;
        if (--event < 0) {
            if (--bar < 0) {
                return undefined;
            }
            event = this.getOutput()[bar].length - 1;
        }
        return this.getOutput()[bar][event];
    }
    outputEvent() {
        return this.getOutput()[this.getTime().bar][this.getTime().event];
    }
    harmonise() {
        this.setOutput([]);
        this.setMaxTime({ bar: 0, event: 0 });
        for (this.setTime({ bar: 0, event: 0 }); this.getTime().bar !== this.getInput().length; this.step()) {
            if (this.getTime().bar < 0) {
                throw "Failed to harmonise.";
            }
            if (this.getTime().bar > this.getMaxTime().bar) {
                this.setMaxTime(Object.assign({}, this.getTime()));
            }
            else if (this.getTime().bar === this.getMaxTime().bar) {
                if (this.getTime().event >= this.getMaxTime().event) {
                    this.getMaxTime().event = this.getTime().event;
                }
            }
        }
        return this;
    }
    step() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        var _s, _t, _u, _v;
        const inputEvent = this.getInput()[this.getTime().bar][this.getTime().event];
        (_a = (_s = this.getOutput())[_t = this.time.bar]) !== null && _a !== void 0 ? _a : (_s[_t] = []);
        (_b = (_u = this.getOutput()[this.time.bar])[_v = this.time.event]) !== null && _b !== void 0 ? _b : (_u[_v] = new Event(Group.empty(), Group.empty(), Group.empty(), Group.empty(), inputEvent.isCadence()));
        const previousChord = (_d = (_c = this.previousOutputEvent()) === null || _c === void 0 ? void 0 : _c.getChord()) !== null && _d !== void 0 ? _d : new Chord(null, "", 0, new Numeral(0, 0, this.key.getTonality()));
        const chordOptions = previousChord.progression(this.dictionary).filter(chord => !this.outputEvent().isCadence() || ["I", "i", "V"].includes(chord.toStringStem()));
        for (; this.outputEvent().map < chordOptions.length; ++this.outputEvent().map) {
            const chord = chordOptions[this.outputEvent().map];
            const resolution = chord.resolve(this.key);
            const defined = {
                s: inputEvent.getS().main() !== undefined,
                a: inputEvent.getA().main() !== undefined,
                t: inputEvent.getT().main() !== undefined,
                b: inputEvent.getB().main() !== undefined
            };
            if (["s", "a", "t", "b"].filter(part => defined[part]).map(part => inputEvent.getPart(part).duration()).some((duration, i, array) => duration !== array[0])) {
                throw "Not all parts have the same duration.";
            }
            if (!defined.s) {
                throw "Soprano line is not defined.";
            }
            this.outputEvent().setS(inputEvent.getS());
            this.outputEvent().setA(inputEvent.getA());
            this.outputEvent().setT(inputEvent.getT());
            this.outputEvent().setB(inputEvent.getB());
            const target = {
                a: (_f = (_e = this.previousOutputEvent()) === null || _e === void 0 ? void 0 : _e.getA().at(-1).getPitch()) !== null && _f !== void 0 ? _f : Pitch.parse("D4"),
                t: (_h = (_g = this.previousOutputEvent()) === null || _g === void 0 ? void 0 : _g.getT().at(-1).getPitch()) !== null && _h !== void 0 ? _h : Pitch.parse("B3"),
                b: (_k = (_j = this.previousOutputEvent()) === null || _j === void 0 ? void 0 : _j.getB().at(-1).getPitch()) !== null && _k !== void 0 ? _k : Pitch.parse("Eb3")
            };
            if (!defined.b) {
                const options = resolution.bass().near(target.b);
                const pitch = options.filter(tone => tone.semitones() >= 28 && tone.semitones() <= 48 && tone.semitones() <= this.outputEvent().getS().main().getPitch().semitones() - 10)[0];
                this.outputEvent().setB(pitch.group(this.outputEvent().duration()));
            }
            if (resolution.excludes((_l = inputEvent.getS().main()) === null || _l === void 0 ? void 0 : _l.getPitch().getTone()) ||
                resolution.excludes((_m = inputEvent.getA().main()) === null || _m === void 0 ? void 0 : _m.getPitch().getTone()) ||
                resolution.excludes((_o = inputEvent.getT().main()) === null || _o === void 0 ? void 0 : _o.getPitch().getTone()) ||
                resolution.excludes((_p = inputEvent.getB().main()) === null || _p === void 0 ? void 0 : _p.getPitch().getTone())) {
                continue;
            }
            if (inputEvent.getB().main() && !inputEvent.getB().main().getPitch().getTone().equals(resolution.bass())) {
                continue;
            }
            if (previousChord.getInversion() === 2 && ((_r = (_q = this.previousPreviousOutputEvent()) === null || _q === void 0 ? void 0 : _q.getChord()) === null || _r === void 0 ? void 0 : _r.string()) === chord.string()) {
                continue;
            }
            const quotas = resolution.getSeventh() ? [1, 1, 1, 1] : [2, 1, 2, 0];
            for (const part of ["s", "a", "t", "b"]) {
                const array = [resolution.getRoot(), resolution.getThird(), resolution.getFifth(), resolution.getSeventh()].filter(tone => tone !== undefined);
                const inversion = array.findIndex((tone) => { var _a; return tone.equals((_a = this.outputEvent().getPart(part).main()) === null || _a === void 0 ? void 0 : _a.getPitch().getTone()); });
                if (inversion !== -1) {
                    --quotas[inversion];
                }
            }
            if (resolution.getSeventh() === undefined) {
                if (quotas[0] === 0) {
                    quotas[2] = 1;
                    if (quotas[2] === 0) {
                        continue;
                    }
                }
                if (quotas[2] === 0) {
                    quotas[0] = 1;
                }
            }
            if (quotas.some(quota => quota < 0)) {
                continue;
            }
            let permutations;
            const ones = quotas.map((quota, inversion) => quota === 1 ? resolution.at(inversion) : undefined).filter(tone => tone !== undefined);
            let a;
            let t;
            if (!defined.a && !defined.t) {
                let two = resolution.at(quotas.findIndex(quota => quota === 2));
                switch (ones.length) {
                    case 1:
                        const permutation1 = {
                            a: a = ones[0].near(target.a)[0],
                            t: t = two.near(target.t)[0],
                            score: this.score(a, t)
                        };
                        const permutation2 = {
                            a: a = two.near(target.a)[0],
                            t: t = ones[0].near(target.t)[0],
                            score: this.score(a, t)
                        };
                        const permutation3 = {
                            a: a = two.near(target.a)[0],
                            t: t = two.near(target.t)[0],
                            score: this.score(a, t)
                        };
                        permutations = [permutation1, permutation2, permutation3].sort((l, r) => l.score - r.score);
                        break;
                    case 2:
                        const permutation4 = {
                            a: a = ones[0].near(target.a)[0],
                            t: t = ones[1].near(target.t)[0],
                            score: this.score(a, t)
                        };
                        const permutation5 = {
                            a: a = ones[1].near(target.a)[0],
                            t: t = ones[0].near(target.t)[0],
                            score: this.score(a, t)
                        };
                        permutations = [permutation4, permutation5].sort((l, r) => l.score - r.score);
                        break;
                    case 3:
                        const permutation6 = {
                            a: a = ones[0].near(target.a)[0],
                            t: t = ones[1].near(target.t)[0],
                            score: this.score(a, t)
                        };
                        const permutation7 = {
                            a: a = ones[1].near(target.a)[0],
                            t: t = ones[0].near(target.t)[0],
                            score: this.score(a, t)
                        };
                        const permutation8 = {
                            a: a = ones[1].near(target.a)[0],
                            t: t = ones[2].near(target.t)[0],
                            score: this.score(a, t)
                        };
                        const permutation9 = {
                            a: a = ones[2].near(target.a)[0],
                            t: t = ones[1].near(target.t)[0],
                            score: this.score(a, t)
                        };
                        permutations = [permutation6, permutation7, permutation8, permutation9].sort((l, r) => l.score - r.score);
                        break;
                }
            }
            else if (defined.a && !defined.t) {
                a = this.outputEvent().getA().main().getPitch();
                if (ones.length === 1) {
                    permutations = [{
                            a: a,
                            t: t = ones[0].near(target.t)[0],
                            score: this.score(a, t)
                        }];
                }
                else {
                    permutations = [{
                            a: a,
                            t: t = ones[0].near(target.t)[0],
                            score: this.score(a, t)
                        }, {
                            a: a,
                            t: t = ones[1].near(target.t)[0],
                            score: this.score(a, t)
                        }];
                }
            }
            else if (!defined.a && defined.t) {
                t = this.outputEvent().getT().main().getPitch();
                if (ones.length === 1) {
                    permutations = [{
                            a: a = ones[0].near(target.a)[0],
                            t: t,
                            score: this.score(a, t)
                        }];
                }
                else {
                    permutations = [{
                            a: a = ones[0].near(target.a)[0],
                            t: t,
                            score: this.score(a, t)
                        }, {
                            a: a = ones[1].near(target.a)[0],
                            t: t,
                            score: this.score(a, t)
                        }];
                }
            }
            else {
                permutations = [{
                        a: a = this.outputEvent().getA().main().getPitch(),
                        t: t = this.outputEvent().getT().main().getPitch(),
                        score: this.score(a, t)
                    }];
            }
            for (const permutation of permutations) {
                if (permutation.score === Infinity) {
                    continue;
                }
                this.outputEvent().setA(permutation.a.group(this.outputEvent().duration()));
                this.outputEvent().setT(permutation.t.group(this.outputEvent().duration()));
                if (this.checkParallel("s", "a") ||
                    this.checkParallel("s", "t") ||
                    this.checkParallel("s", "b") ||
                    this.checkParallel("a", "t") ||
                    this.checkParallel("a", "b") ||
                    this.checkParallel("t", "b")) {
                    continue;
                }
                this.outputEvent().setChord(chord);
                if (++this.getTime().event === this.getInput()[this.getTime().bar].length) {
                    this.getTime().event = 0;
                    ++this.getTime().bar;
                }
                return;
            }
            continue;
        }
        this.outputEvent().map = 0;
        if (--this.getTime().event < 0) {
            if (--this.getTime().bar >= 0) {
                this.getTime().event = this.getInput()[this.getTime().bar].length - 1;
            }
        }
        if (this.getTime().bar >= 0) {
            ++this.outputEvent().map;
        }
        return;
    }
    score(aPitch, tPitch) {
        var _a, _b, _c, _d;
        const s = this.outputEvent().getS().main().getPitch().semitones();
        const a = aPitch.semitones();
        const t = tPitch.semitones();
        const b = this.outputEvent().getB().main().getPitch().semitones();
        const previousA = (_b = (_a = this.previousOutputEvent()) === null || _a === void 0 ? void 0 : _a.getA().at(-1).getPitch()) !== null && _b !== void 0 ? _b : Pitch.parse("D4");
        const previousT = (_d = (_c = this.previousOutputEvent()) === null || _c === void 0 ? void 0 : _c.getT().at(-1).getPitch()) !== null && _d !== void 0 ? _d : Pitch.parse("B3");
        const aChange = Math.abs(a - previousA.semitones());
        const tChange = Math.abs(t - previousT.semitones());
        if (aChange > 7 ||
            tChange > 7 ||
            a > s ||
            t > a ||
            b > t ||
            a > 64 ||
            a < 43 ||
            t < 40 ||
            t > 52) {
            return Infinity;
        }
        const sa = s - a;
        const at = a - t;
        const stdDev = Math.sqrt((sa * sa + at * at) / 2 - (sa + at) ** 2 / 4);
        const score = aChange + tChange + stdDev;
        return score;
    }
    checkParallel(upper, lower) {
        const previousEvent = this.previousOutputEvent();
        if (previousEvent === undefined) {
            return false;
        }
        const previousUpper = previousEvent.getPart(upper).at(-1).getPitch().semitones();
        const previousLower = previousEvent.getPart(lower).at(-1).getPitch().semitones();
        const currentUpper = this.outputEvent().getPart(upper).at(0).getPitch().semitones();
        const currentLower = this.outputEvent().getPart(lower).at(0).getPitch().semitones();
        const previousInterval = (previousUpper - previousLower) % 12;
        const interval = (currentUpper - currentLower) % 12;
        return (previousInterval === 0 && interval === 0 || previousInterval === 7 && interval === 7) && previousUpper !== currentUpper && previousLower !== currentLower;
    }
    getInput() {
        return this.input;
    }
    setInput(input) {
        this.input = input;
        return this;
    }
    getOutput() {
        return this.output;
    }
    setOutput(output) {
        this.output = output;
        return this;
    }
    getTime() {
        return this.time;
    }
    setTime(time) {
        this.time = time;
        return this;
    }
    getMaxTime() {
        return this.maxTime;
    }
    setMaxTime(maxTime) {
        this.maxTime = maxTime;
        return this;
    }
    getKey() {
        return this.key;
    }
    setKey(key) {
        this.key = key;
        return this;
    }
    getDictionary() {
        return this.dictionary;
    }
    setDictionary(dictionary) {
        this.dictionary = dictionary;
        return this;
    }
    string() {
        return `[${this.getOutput().map(bar => bar.map(event => event.getS().string().padEnd(8)).join(" ")).join("|")}]
[${this.getOutput().map(bar => bar.map(event => event.getA().string().padEnd(8)).join(" ")).join("|")}]
[${this.getOutput().map(bar => bar.map(event => event.getT().string().padEnd(8)).join(" ")).join("|")}]
[${this.getOutput().map(bar => bar.map(event => event.getB().string().padEnd(8)).join(" ")).join("|")}]
[${this.getOutput().map(bar => bar.map(event => { var _a; return (_a = event.getChord()) === null || _a === void 0 ? void 0 : _a.string().padEnd(8); }).join(" ")).join("|")}]`;
    }
}


/***/ }),

/***/ 411:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ Pitch)
/* harmony export */ });
/* harmony import */ var _group_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(892);
/* harmony import */ var _note_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(472);
/* harmony import */ var _tone_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(237);



class Pitch {
    constructor(tone, octave) {
        this.tone = tone;
        this.octave = octave;
    }
    static parse(string) {
        const result = string.match(/^([A-G](bb|b|#|x|))([1-6])$/);
        if (result === null) {
            throw `Could not parse pitch '${string}'`;
        }
        return new Pitch(_tone_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"].parse */ .Z.parse(result[1]), Number(result[3]));
    }
    semitones() {
        return this.getTone().semitones() + 12 * this.getOctave();
    }
    near(tone) {
        const tone1 = new Pitch(tone, this.getOctave() - 1);
        const tone2 = new Pitch(tone, this.getOctave());
        const tone3 = new Pitch(tone, this.getOctave() + 1);
        return [tone1, tone2, tone3].sort((l, r) => Math.abs(this.semitones() - l.semitones()) - Math.abs(this.semitones() - r.semitones()));
    }
    getTone() {
        return this.tone;
    }
    setTone(tone) {
        this.tone = tone;
        return this;
    }
    getOctave() {
        return this.octave;
    }
    setOctave(octave) {
        this.octave = octave;
        return this;
    }
    string() {
        return this.getTone().string() + this.getOctave();
    }
    group(duration) {
        return new _group_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z([new _note_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z(this, duration)], 0);
    }
}


/***/ }),

/***/ 93:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ Resolution)
/* harmony export */ });
class Resolution {
    constructor(root, third, fifth, seventh, inversion) {
        this.root = root;
        this.third = third;
        this.fifth = fifth;
        this.seventh = seventh;
        this.inversion = inversion;
    }
    at(inversion) {
        switch (inversion) {
            case 0: return this.root;
            case 1: return this.third;
            case 2: return this.fifth;
            case 3: return this.seventh;
        }
    }
    bass() {
        return this.at(this.inversion);
    }
    excludes(testTone) {
        var _a, _b, _c, _d;
        if (testTone === undefined) {
            return false;
        }
        return !((_a = this.root) === null || _a === void 0 ? void 0 : _a.equals(testTone)) && !((_b = this.third) === null || _b === void 0 ? void 0 : _b.equals(testTone)) && !((_c = this.fifth) === null || _c === void 0 ? void 0 : _c.equals(testTone)) && !((_d = this.seventh) === null || _d === void 0 ? void 0 : _d.equals(testTone));
    }
    getRoot() {
        return this.root;
    }
    setRoot(root) {
        this.root = root;
        return this;
    }
    getThird() {
        return this.third;
    }
    setThird(third) {
        this.third = third;
        return this;
    }
    getFifth() {
        return this.fifth;
    }
    setFifth(fifth) {
        this.fifth = fifth;
        return this;
    }
    getSeventh() {
        return this.seventh;
    }
    setSeventh(seventh) {
        this.seventh = seventh;
        return this;
    }
    string() {
        const array = [this.root, this.third, this.fifth, this.seventh].filter(tone => tone).map(tone => tone === null || tone === void 0 ? void 0 : tone.string());
        array[this.inversion] = `{${array[this.inversion]}}`;
        return array.join(" ");
    }
}


/***/ }),

/***/ 237:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ Tone)
/* harmony export */ });
/* harmony import */ var _pitch_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(411);

class Tone {
    constructor(letter, accidental) {
        this.letter = letter;
        this.accidental = accidental;
    }
    static parse(string) {
        const result = string.match(/^([A-G])(bb|x|b|#|)$/);
        if (result === null) {
            throw `Could not parse tone '${string}'`;
        }
        return new Tone(Tone.LETTERS.indexOf(result[1]), Tone.ACCIDENTALS.indexOf(result[2]));
    }
    semitones() {
        return Tone.PITCHES[this.letter] + this.accidental;
    }
    equals(tone) {
        if (tone === undefined) {
            return false;
        }
        return this.letter === tone.letter && this.accidental === tone.accidental;
    }
    near(pitch) {
        const tone1 = new _pitch_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z(this, pitch.getOctave() - 1);
        const tone2 = new _pitch_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z(this, pitch.getOctave());
        const tone3 = new _pitch_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z(this, pitch.getOctave() + 1);
        return [tone1, tone2, tone3].sort((l, r) => Math.abs(pitch.semitones() - l.semitones()) - Math.abs(pitch.semitones() - r.semitones()));
    }
    getLetter() {
        return this.letter;
    }
    setLetter(letter) {
        this.letter = letter;
        return this;
    }
    getAccidental() {
        return this.accidental;
    }
    setAccidental(accidental) {
        if (accidental >= -2 && accidental <= 2) {
            this.accidental = accidental;
        }
        return this;
    }
    alterAccidental(accidental) {
        const altered = this.accidental + accidental;
        if (altered >= -2 && altered <= 2) {
            this.accidental = altered;
        }
        return this;
    }
    string() {
        return Tone.LETTERS[this.letter] + Tone.ACCIDENTALS[this.accidental];
    }
}
Tone.ACCIDENTALS = ["", "#", "x"];
(() => {
    Tone.ACCIDENTALS[-2] = "bb";
    Tone.ACCIDENTALS[-1] = "b";
})();
Tone.LETTERS = ["C", "D", "E", "F", "G", "A", "B"];
Tone.PITCHES = [0, 2, 4, 5, 7, 9, 11];


/***/ }),

/***/ 740:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var Util;
(function (Util) {
    class Printable {
    }
    Util.Printable = Printable;
})(Util || (Util = {}));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Util);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	__webpack_require__(590);
/******/ 	__webpack_require__(781);
/******/ 	__webpack_require__(790);
/******/ 	__webpack_require__(892);
/******/ 	__webpack_require__(850);
/******/ 	__webpack_require__(799);
/******/ 	__webpack_require__(472);
/******/ 	__webpack_require__(345);
/******/ 	__webpack_require__(423);
/******/ 	__webpack_require__(411);
/******/ 	__webpack_require__(93);
/******/ 	__webpack_require__(237);
/******/ 	var __webpack_exports__ = __webpack_require__(740);
/******/ 	window.JSB = __webpack_exports__;
/******/ 	
/******/ })()
;