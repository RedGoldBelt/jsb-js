System.register("event", [], function (exports_1, context_1) {
    "use strict";
    var Event;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            Event = (function () {
                function Event(s, a, t, b, cadence) {
                    this.map = 0;
                    this.s = s;
                    this.a = a;
                    this.t = t;
                    this.b = b;
                    this.cadence = cadence;
                }
                Event.prototype.getS = function () {
                    return this.s;
                };
                Event.prototype.setS = function (s) {
                    this.s = s;
                    return this;
                };
                Event.prototype.getA = function () {
                    return this.a;
                };
                Event.prototype.setA = function (a) {
                    this.a = a;
                    return this;
                };
                Event.prototype.getT = function () {
                    return this.t;
                };
                Event.prototype.setT = function (t) {
                    this.t = t;
                    return this;
                };
                Event.prototype.getB = function () {
                    return this.b;
                };
                Event.prototype.setB = function (b) {
                    this.b = b;
                    return this;
                };
                Event.prototype.getPart = function (part) {
                    switch (part) {
                        case "s": return this.getS();
                        case "a": return this.getA();
                        case "t": return this.getT();
                        case "b": return this.getB();
                    }
                };
                Event.prototype.setPart = function (part, group) {
                    switch (part) {
                        case "s": return this.setS(group);
                        case "a": return this.setA(group);
                        case "t": return this.setT(group);
                        case "b": return this.setB(group);
                    }
                };
                Event.prototype.duration = function () {
                    var _a, _b, _c, _d;
                    return (_d = (_c = (_b = (_a = this.getS().duration()) !== null && _a !== void 0 ? _a : this.getA().duration) !== null && _b !== void 0 ? _b : this.getT().duration) !== null && _c !== void 0 ? _c : this.getB().duration) !== null && _d !== void 0 ? _d : 0;
                };
                Event.prototype.getChord = function () {
                    return this.chord;
                };
                Event.prototype.setChord = function (chord) {
                    this.chord = chord;
                    return this;
                };
                Event.prototype.isCadence = function () {
                    return this.cadence;
                };
                return Event;
            }());
            exports_1("default", Event);
        }
    };
});
System.register("util", [], function (exports_2, context_2) {
    "use strict";
    var Util;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [],
        execute: function () {
            (function (Util) {
                var Printable = (function () {
                    function Printable() {
                    }
                    return Printable;
                }());
                Util.Printable = Printable;
            })(Util || (Util = {}));
            exports_2("default", Util);
        }
    };
});
System.register("note", ["pitch"], function (exports_3, context_3) {
    "use strict";
    var pitch_js_1, Note;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [
            function (pitch_js_1_1) {
                pitch_js_1 = pitch_js_1_1;
            }
        ],
        execute: function () {
            Note = (function () {
                function Note(pitch, duration) {
                    this.pitch = pitch;
                    this.duration = duration;
                }
                Note.parse = function (string) {
                    var result = string.match(/^([A-G](bb|b|#|x|)[1-6])(_*)(\/*)(\.*)$/);
                    if (result === null) {
                        throw "Could not parse note '".concat(string, "'");
                    }
                    return new Note(pitch_js_1.default.parse(result[1]), Math.pow(2, (result[3].length - result[4].length)) * Math.pow(1.5, result[5].length));
                };
                Note.prototype.getPitch = function () {
                    return this.pitch;
                };
                Note.prototype.setPitch = function (pitch) {
                    this.pitch = pitch;
                    return this;
                };
                Note.prototype.getDuration = function () {
                    return this.duration;
                };
                Note.prototype.setDuration = function (duration) {
                    this.duration = duration;
                    return this;
                };
                Note.prototype.string = function () {
                    var string = this.getPitch().string();
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
                };
                return Note;
            }());
            exports_3("default", Note);
        }
    };
});
System.register("group", ["note"], function (exports_4, context_4) {
    "use strict";
    var note_js_1, Group;
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [
            function (note_js_1_1) {
                note_js_1 = note_js_1_1;
            }
        ],
        execute: function () {
            Group = (function () {
                function Group(notes, index) {
                    this.notes = notes;
                    this.index = index;
                }
                Group.parse = function (string) {
                    if (string.startsWith("(") && string.endsWith(")")) {
                        var array = string.slice(1, -1).split(",").map(function (string) { return note_js_1.default.parse(string); });
                        return new Group(array, 0);
                    }
                    return new Group([note_js_1.default.parse(string)], 0);
                };
                Group.empty = function () {
                    return new Group([], 0);
                };
                Group.prototype.main = function () {
                    return this.getNotes()[this.getIndex()];
                };
                Group.prototype.at = function (index) {
                    if (index < 0) {
                        index = this.getNotes().length + index;
                    }
                    return this.getNotes()[index];
                };
                Group.prototype.duration = function () {
                    return this.getNotes().map(function (note) { return note.getDuration(); }).reduce(function (l, r) { return l + r; });
                };
                Group.prototype.getNotes = function () {
                    return this.notes;
                };
                Group.prototype.setNotes = function (notes) {
                    this.notes = notes;
                    return this;
                };
                Group.prototype.getIndex = function () {
                    return this.index;
                };
                Group.prototype.setIndex = function (index) {
                    this.index = index;
                    return this;
                };
                Group.prototype.string = function () {
                    return this.getNotes().map(function (note) { return note.string(); }).join(" ");
                };
                return Group;
            }());
            exports_4("default", Group);
        }
    };
});
System.register("pitch", ["group", "note", "tone"], function (exports_5, context_5) {
    "use strict";
    var group_js_1, note_js_2, tone_js_1, Pitch;
    var __moduleName = context_5 && context_5.id;
    return {
        setters: [
            function (group_js_1_1) {
                group_js_1 = group_js_1_1;
            },
            function (note_js_2_1) {
                note_js_2 = note_js_2_1;
            },
            function (tone_js_1_1) {
                tone_js_1 = tone_js_1_1;
            }
        ],
        execute: function () {
            Pitch = (function () {
                function Pitch(tone, octave) {
                    this.tone = tone;
                    this.octave = octave;
                }
                Pitch.parse = function (string) {
                    var result = string.match(/^([A-G](bb|b|#|x|))([1-6])$/);
                    if (result === null) {
                        throw "Could not parse pitch '".concat(string, "'");
                    }
                    return new Pitch(tone_js_1.default.parse(result[1]), Number(result[3]));
                };
                Pitch.prototype.semitones = function () {
                    return this.getTone().semitones() + 12 * this.getOctave();
                };
                Pitch.prototype.near = function (tone) {
                    var _this = this;
                    var tone1 = new Pitch(tone, this.getOctave() - 1);
                    var tone2 = new Pitch(tone, this.getOctave());
                    var tone3 = new Pitch(tone, this.getOctave() + 1);
                    return [tone1, tone2, tone3].sort(function (l, r) { return Math.abs(_this.semitones() - l.semitones()) - Math.abs(_this.semitones() - r.semitones()); });
                };
                Pitch.prototype.getTone = function () {
                    return this.tone;
                };
                Pitch.prototype.setTone = function (tone) {
                    this.tone = tone;
                    return this;
                };
                Pitch.prototype.getOctave = function () {
                    return this.octave;
                };
                Pitch.prototype.setOctave = function (octave) {
                    this.octave = octave;
                    return this;
                };
                Pitch.prototype.string = function () {
                    return this.getTone().string() + this.getOctave();
                };
                Pitch.prototype.group = function (duration) {
                    return new group_js_1.default([new note_js_2.default(this, duration)], 0);
                };
                return Pitch;
            }());
            exports_5("default", Pitch);
        }
    };
});
System.register("tone", ["pitch"], function (exports_6, context_6) {
    "use strict";
    var pitch_js_2, Tone;
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [
            function (pitch_js_2_1) {
                pitch_js_2 = pitch_js_2_1;
            }
        ],
        execute: function () {
            Tone = (function () {
                function Tone(letter, accidental) {
                    this.letter = letter;
                    this.accidental = accidental;
                }
                Tone.parse = function (string) {
                    var result = string.match(/^([A-G])(bb|x|b|#|)$/);
                    if (result === null) {
                        throw "Could not parse tone '".concat(string, "'");
                    }
                    return new Tone(Tone.LETTERS.indexOf(result[1]), Tone.ACCIDENTALS.indexOf(result[2]));
                };
                Tone.prototype.semitones = function () {
                    return Tone.PITCHES[this.letter] + this.accidental;
                };
                Tone.prototype.equals = function (tone) {
                    if (tone === undefined) {
                        return false;
                    }
                    return this.letter === tone.letter && this.accidental === tone.accidental;
                };
                Tone.prototype.near = function (pitch) {
                    var tone1 = new pitch_js_2.default(this, pitch.getOctave() - 1);
                    var tone2 = new pitch_js_2.default(this, pitch.getOctave());
                    var tone3 = new pitch_js_2.default(this, pitch.getOctave() + 1);
                    return [tone1, tone2, tone3].sort(function (l, r) { return Math.abs(pitch.semitones() - l.semitones()) - Math.abs(pitch.semitones() - r.semitones()); });
                };
                Tone.prototype.getLetter = function () {
                    return this.letter;
                };
                Tone.prototype.setLetter = function (letter) {
                    this.letter = letter;
                    return this;
                };
                Tone.prototype.getAccidental = function () {
                    return this.accidental;
                };
                Tone.prototype.setAccidental = function (accidental) {
                    if (accidental >= -2 && accidental <= 2) {
                        this.accidental = accidental;
                    }
                    return this;
                };
                Tone.prototype.alterAccidental = function (accidental) {
                    var altered = this.accidental + accidental;
                    if (altered >= -2 && altered <= 2) {
                        this.accidental = altered;
                    }
                    return this;
                };
                Tone.prototype.string = function () {
                    return Tone.LETTERS[this.letter] + Tone.ACCIDENTALS[this.accidental];
                };
                Tone.ACCIDENTALS = ["", "#", "x"];
                (function () {
                    Tone.ACCIDENTALS[-2] = "bb";
                    Tone.ACCIDENTALS[-1] = "b";
                })();
                Tone.LETTERS = ["C", "D", "E", "F", "G", "A", "B"];
                Tone.PITCHES = [0, 2, 4, 5, 7, 9, 11];
                return Tone;
            }());
            exports_6("default", Tone);
        }
    };
});
System.register("key", ["tone"], function (exports_7, context_7) {
    "use strict";
    var tone_js_2, Key;
    var __moduleName = context_7 && context_7.id;
    return {
        setters: [
            function (tone_js_2_1) {
                tone_js_2 = tone_js_2_1;
            }
        ],
        execute: function () {
            Key = (function () {
                function Key(tone, tonality) {
                    this.tone = tone;
                    this.tonality = tonality;
                }
                Key.parse = function (string) {
                    var result = string.match(/^(C|D|E|F|G|A|B)(bb|x|b|#|) (major|minor)$/);
                    if (result === null) {
                        throw "Could not parse key '".concat(string, "'");
                    }
                    return new Key(tone_js_2.default.parse(result[1] + result[2]), result[3] === "major");
                };
                Key.prototype.degree = function (degree, relativePitch) {
                    degree %= 7;
                    relativePitch !== null && relativePitch !== void 0 ? relativePitch : (relativePitch = (this.getTonality() ? [0, 2, 4, 5, 7, 9, 11] : [0, 2, 3, 5, 7, 8, 10])[degree]);
                    var top = new tone_js_2.default((this.getTone().getLetter() + degree) % 7, 0);
                    top.setAccidental((relativePitch - top.semitones() + this.getTone().semitones() + 18) % 12 - 6);
                    return top;
                };
                Key.prototype.accidentals = function () {
                    var accidentals = (2 * this.getTone().getLetter()) % 7 + 7 * this.getTone().getAccidental();
                    if (this.getTone().getLetter() === 3) {
                        accidentals -= 7;
                    }
                    if (!this.tonality) {
                        accidentals -= 3;
                    }
                    return accidentals;
                };
                Key.prototype.signature = function () {
                    var accidentals = this.accidentals();
                    return [
                        Math.floor((accidentals + 5) / 7),
                        Math.floor((accidentals + 3) / 7),
                        Math.floor((accidentals + 1) / 7),
                        Math.floor((accidentals + 6) / 7),
                        Math.floor((accidentals + 4) / 7),
                        Math.floor((accidentals + 2) / 7),
                        Math.floor(accidentals / 7)
                    ];
                };
                Key.prototype.getTone = function () {
                    return this.tone;
                };
                Key.prototype.setTone = function (tone) {
                    this.tone = tone;
                    return this;
                };
                Key.prototype.getTonality = function () {
                    return this.tonality;
                };
                Key.prototype.setTonality = function (tonality) {
                    this.tonality = tonality;
                    return this;
                };
                Key.prototype.string = function () {
                    return this.getTone().string() + " " + (this.getTonality() ? "major" : "minor");
                };
                return Key;
            }());
            exports_7("default", Key);
        }
    };
});
System.register("numeral", ["tone"], function (exports_8, context_8) {
    "use strict";
    var tone_js_3, Numeral;
    var __moduleName = context_8 && context_8.id;
    return {
        setters: [
            function (tone_js_3_1) {
                tone_js_3 = tone_js_3_1;
            }
        ],
        execute: function () {
            Numeral = (function () {
                function Numeral(accidental, degree, tonality) {
                    this.accidental = accidental;
                    this.degree = degree;
                    this.tonality = tonality;
                }
                Numeral.parse = function (string) {
                    var result = string.match(/^(b|#|)(III|iii|VII|vii|II|ii|IV|iv|VI|vi|I|i|V|v)$/);
                    if (result === null) {
                        throw "Could not parse numeral '".concat(string, "'");
                    }
                    return new Numeral(tone_js_3.default.ACCIDENTALS.indexOf(result[1]), Numeral.NUMERALS.indexOf(result[2].toLowerCase()), result[2] === result[2].toUpperCase());
                };
                Numeral.prototype.getAccidental = function () {
                    return this.accidental;
                };
                Numeral.prototype.setAccidental = function (accidental) {
                    this.accidental = accidental;
                    return this;
                };
                Numeral.prototype.getDegree = function () {
                    return this.degree;
                };
                Numeral.prototype.setDegree = function (degree) {
                    this.degree = degree;
                    return this;
                };
                Numeral.prototype.getTonality = function () {
                    return this.tonality;
                };
                Numeral.prototype.setTonality = function (tonality) {
                    this.tonality = tonality;
                    return this;
                };
                Numeral.prototype.string = function () {
                    return tone_js_3.default.ACCIDENTALS[this.accidental] + Numeral.NUMERALS[this.degree][this.tonality ? "toUpperCase" : "toLowerCase"]();
                };
                Numeral.NUMERALS = ["i", "ii", "iii", "iv", "v", "vi", "vii"];
                return Numeral;
            }());
            exports_8("default", Numeral);
        }
    };
});
System.register("resolution", [], function (exports_9, context_9) {
    "use strict";
    var Resolution;
    var __moduleName = context_9 && context_9.id;
    return {
        setters: [],
        execute: function () {
            Resolution = (function () {
                function Resolution(root, third, fifth, seventh, inversion) {
                    this.root = root;
                    this.third = third;
                    this.fifth = fifth;
                    this.seventh = seventh;
                    this.inversion = inversion;
                }
                Resolution.prototype.at = function (inversion) {
                    switch (inversion) {
                        case 0: return this.root;
                        case 1: return this.third;
                        case 2: return this.fifth;
                        case 3: return this.seventh;
                    }
                };
                Resolution.prototype.bass = function () {
                    return this.at(this.inversion);
                };
                Resolution.prototype.excludes = function (testTone) {
                    var _a, _b, _c, _d;
                    if (testTone === undefined) {
                        return false;
                    }
                    return !((_a = this.root) === null || _a === void 0 ? void 0 : _a.equals(testTone)) && !((_b = this.third) === null || _b === void 0 ? void 0 : _b.equals(testTone)) && !((_c = this.fifth) === null || _c === void 0 ? void 0 : _c.equals(testTone)) && !((_d = this.seventh) === null || _d === void 0 ? void 0 : _d.equals(testTone));
                };
                Resolution.prototype.getRoot = function () {
                    return this.root;
                };
                Resolution.prototype.setRoot = function (root) {
                    this.root = root;
                    return this;
                };
                Resolution.prototype.getThird = function () {
                    return this.third;
                };
                Resolution.prototype.setThird = function (third) {
                    this.third = third;
                    return this;
                };
                Resolution.prototype.getFifth = function () {
                    return this.fifth;
                };
                Resolution.prototype.setFifth = function (fifth) {
                    this.fifth = fifth;
                    return this;
                };
                Resolution.prototype.getSeventh = function () {
                    return this.seventh;
                };
                Resolution.prototype.setSeventh = function (seventh) {
                    this.seventh = seventh;
                    return this;
                };
                Resolution.prototype.string = function () {
                    var array = [this.root, this.third, this.fifth, this.seventh].filter(function (tone) { return tone; }).map(function (tone) { return tone === null || tone === void 0 ? void 0 : tone.string(); });
                    array[this.inversion] = "{".concat(array[this.inversion], "}");
                    return array.join(" ");
                };
                return Resolution;
            }());
            exports_9("default", Resolution);
        }
    };
});
System.register("chord", ["key", "numeral", "resolution"], function (exports_10, context_10) {
    "use strict";
    var key_js_1, numeral_js_1, resolution_js_1, Chord;
    var __moduleName = context_10 && context_10.id;
    return {
        setters: [
            function (key_js_1_1) {
                key_js_1 = key_js_1_1;
            },
            function (numeral_js_1_1) {
                numeral_js_1 = numeral_js_1_1;
            },
            function (resolution_js_1_1) {
                resolution_js_1 = resolution_js_1_1;
            }
        ],
        execute: function () {
            Chord = (function () {
                function Chord(base, alteration, inversion, relativeKey) {
                    this.base = base;
                    this.alteration = alteration;
                    this.inversion = inversion;
                    this.relativeKey = relativeKey;
                }
                Chord.parse = function (string) {
                    var result = string.match(/^((b|#|)(III|iii|VII|vii|II|ii|IV|iv|VI|vi|I|i|V|v))(o7|7|)([a-d])?(\/((b|#|)(III|iii|VII|vii|II|ii|IV|iv|VI|vi|I|i|V|v)))?$/);
                    if (result === null) {
                        throw "Could not parse chord '".concat(string, "'");
                    }
                    return new Chord(numeral_js_1.default.parse(result[1]), result[4], (result[5] ? Chord.INVERSIONS.indexOf(result[5]) : 0), result[6] ? numeral_js_1.default.parse(result[7]) : numeral_js_1.default.parse("I"));
                };
                Chord.prototype.resolve = function (key) {
                    if (this.base === null) {
                        throw "Cannot resolve chord with base 'null'";
                    }
                    if (this.relativeKey) {
                        key = new key_js_1.default(key.degree(this.relativeKey.getDegree()), this.relativeKey.getTonality());
                    }
                    var rootPitch = key.degree(this.base.getDegree()).alterAccidental(this.base.getAccidental()).semitones() - key.degree(0).semitones();
                    var third = key.degree(this.base.getDegree() + 2, rootPitch + (this.base.getTonality() ? 4 : 3));
                    var fifth;
                    var seventh;
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
                    return new resolution_js_1.default(key.degree(this.base.getDegree()).alterAccidental(this.base.getAccidental()), third, fifth, seventh, this.inversion);
                };
                Chord.prototype.progression = function (dictionary) {
                    var _this = this;
                    var _a, _b;
                    var SPECIFIC = (_a = dictionary.SPECIFIC) === null || _a === void 0 ? void 0 : _a[this.relativeKey.string()][this.toStringStem()];
                    var SPECIFIC_OPTIONS = SPECIFIC === null || SPECIFIC === void 0 ? void 0 : SPECIFIC.map(Chord.parse);
                    var COMMON = (this.relativeKey.getTonality() ? dictionary.COMMON.MAJOR : dictionary.COMMON.MINOR)[this.toStringStem()];
                    var COMMON_OPTIONS = COMMON.map(function (string) {
                        var chord = Chord.parse(string);
                        chord.relativeKey = _this.relativeKey;
                        return chord;
                    });
                    return (_b = SPECIFIC_OPTIONS === null || SPECIFIC_OPTIONS === void 0 ? void 0 : SPECIFIC_OPTIONS.concat(COMMON_OPTIONS)) !== null && _b !== void 0 ? _b : COMMON_OPTIONS;
                };
                Chord.prototype.getInversion = function () {
                    return this.inversion;
                };
                Chord.prototype.setInversion = function (inversion) {
                    this.inversion = inversion;
                    return this;
                };
                Chord.prototype.toStringStem = function () {
                    return this.base ? this.base.string() + this.alteration + (this.inversion ? Chord.INVERSIONS[this.inversion] : "") : "start";
                };
                Chord.prototype.string = function () {
                    var string = this.toStringStem();
                    if (!(this.relativeKey.getDegree() === 0 && this.relativeKey.getAccidental() === 0)) {
                        string += "/" + this.relativeKey.string();
                    }
                    return string;
                };
                Chord.INVERSIONS = ["a", "b", "c", "d"];
                return Chord;
            }());
            exports_10("default", Chord);
        }
    };
});
System.register("dictionary", [], function (exports_11, context_11) {
    "use strict";
    var Dict;
    var __moduleName = context_11 && context_11.id;
    return {
        setters: [],
        execute: function () {
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
            exports_11("default", Dict);
        }
    };
});
System.register("piece", ["chord", "dictionary", "event", "group", "key", "numeral", "pitch"], function (exports_12, context_12) {
    "use strict";
    var chord_js_1, dictionary_js_1, event_js_1, group_js_2, key_js_2, numeral_js_2, pitch_js_3, Piece;
    var __moduleName = context_12 && context_12.id;
    return {
        setters: [
            function (chord_js_1_1) {
                chord_js_1 = chord_js_1_1;
            },
            function (dictionary_js_1_1) {
                dictionary_js_1 = dictionary_js_1_1;
            },
            function (event_js_1_1) {
                event_js_1 = event_js_1_1;
            },
            function (group_js_2_1) {
                group_js_2 = group_js_2_1;
            },
            function (key_js_2_1) {
                key_js_2 = key_js_2_1;
            },
            function (numeral_js_2_1) {
                numeral_js_2 = numeral_js_2_1;
            },
            function (pitch_js_3_1) {
                pitch_js_3 = pitch_js_3_1;
            }
        ],
        execute: function () {
            Piece = (function () {
                function Piece() {
                    this.input = [];
                    this.output = [];
                    this.time = { bar: 0, event: 0 };
                    this.maxTime = { bar: 0, event: 0 };
                    this.key = key_js_2.default.parse("C major");
                    this.dictionary = dictionary_js_1.default.FULL;
                }
                Piece.prototype.parse = function (string, part) {
                    var _a, _b;
                    var _c, _d;
                    var split = string.split(/[[|\]]/).filter(function (bar) { return bar !== ""; }).map(function (bar) { return bar.split(" ").filter(function (group) { return group !== ""; }); });
                    for (var bar = 0; bar < split.length; ++bar) {
                        (_a = (_c = this.getInput())[bar]) !== null && _a !== void 0 ? _a : (_c[bar] = []);
                        for (var event = 0; event < split[bar].length; ++event) {
                            var cadence = split[bar][event].endsWith("@");
                            if (cadence) {
                                split[bar][event] = split[bar][event].slice(0, -1);
                            }
                            (_b = (_d = this.getInput()[bar])[event]) !== null && _b !== void 0 ? _b : (_d[event] = new event_js_1.default(group_js_2.default.empty(), group_js_2.default.empty(), group_js_2.default.empty(), group_js_2.default.empty(), cadence));
                            this.getInput()[bar][event][part] = group_js_2.default.parse(split[bar][event]);
                        }
                    }
                    return this;
                };
                Piece.prototype.previousPreviousOutputEvent = function () {
                    var _a = this.time, bar = _a.bar, event = _a.event;
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
                };
                Piece.prototype.previousOutputEvent = function () {
                    var _a = this.time, bar = _a.bar, event = _a.event;
                    if (--event < 0) {
                        if (--bar < 0) {
                            return undefined;
                        }
                        event = this.getOutput()[bar].length - 1;
                    }
                    return this.getOutput()[bar][event];
                };
                Piece.prototype.outputEvent = function () {
                    return this.getOutput()[this.getTime().bar][this.getTime().event];
                };
                Piece.prototype.harmonise = function () {
                    this.setOutput([]);
                    this.setMaxTime({ bar: 0, event: 0 });
                    for (this.setTime({ bar: 0, event: 0 }); this.getTime().bar !== this.getInput().length; this.step()) {
                        if (this.getTime().bar < 0) {
                            throw "Failed to harmonise.";
                        }
                        if (this.getTime().bar > this.getMaxTime().bar) {
                            this.setMaxTime({ bar: this.getTime().bar, event: this.getTime().event });
                        }
                        else if (this.getTime().bar === this.getMaxTime().bar) {
                            if (this.getTime().event >= this.getMaxTime().event) {
                                this.getMaxTime().event = this.getTime().event;
                            }
                        }
                    }
                    return this;
                };
                Piece.prototype.step = function () {
                    var _this = this;
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
                    var _s, _t, _u, _v;
                    var inputEvent = this.getInput()[this.getTime().bar][this.getTime().event];
                    (_a = (_s = this.getOutput())[_t = this.time.bar]) !== null && _a !== void 0 ? _a : (_s[_t] = []);
                    (_b = (_u = this.getOutput()[this.time.bar])[_v = this.time.event]) !== null && _b !== void 0 ? _b : (_u[_v] = new event_js_1.default(group_js_2.default.empty(), group_js_2.default.empty(), group_js_2.default.empty(), group_js_2.default.empty(), inputEvent.isCadence()));
                    var previousChord = (_d = (_c = this.previousOutputEvent()) === null || _c === void 0 ? void 0 : _c.getChord()) !== null && _d !== void 0 ? _d : new chord_js_1.default(null, "", 0, new numeral_js_2.default(0, 0, this.key.getTonality()));
                    var chordOptions = previousChord.progression(this.dictionary).filter(function (chord) { return !_this.outputEvent().isCadence() || ["I", "i", "V"].includes(chord.toStringStem()); });
                    var _loop_1 = function () {
                        var chord = chordOptions[this_1.outputEvent().map];
                        var resolution = chord.resolve(this_1.key);
                        var defined = {
                            s: inputEvent.getS().main() !== undefined,
                            a: inputEvent.getA().main() !== undefined,
                            t: inputEvent.getT().main() !== undefined,
                            b: inputEvent.getB().main() !== undefined
                        };
                        if (["s", "a", "t", "b"].filter(function (part) { return defined[part]; }).map(function (part) { return inputEvent.getPart(part).duration(); }).some(function (duration, i, array) { return duration !== array[0]; })) {
                            throw "Not all parts have the same duration.";
                        }
                        if (!defined.s) {
                            throw "Soprano line is not defined.";
                        }
                        this_1.outputEvent().setS(inputEvent.getS());
                        this_1.outputEvent().setA(inputEvent.getA());
                        this_1.outputEvent().setT(inputEvent.getT());
                        this_1.outputEvent().setB(inputEvent.getB());
                        var target = {
                            a: (_f = (_e = this_1.previousOutputEvent()) === null || _e === void 0 ? void 0 : _e.getA().at(-1).getPitch()) !== null && _f !== void 0 ? _f : pitch_js_3.default.parse("D4"),
                            t: (_h = (_g = this_1.previousOutputEvent()) === null || _g === void 0 ? void 0 : _g.getT().at(-1).getPitch()) !== null && _h !== void 0 ? _h : pitch_js_3.default.parse("B3"),
                            b: (_k = (_j = this_1.previousOutputEvent()) === null || _j === void 0 ? void 0 : _j.getB().at(-1).getPitch()) !== null && _k !== void 0 ? _k : pitch_js_3.default.parse("Eb3")
                        };
                        if (!defined.b) {
                            var options = resolution.bass().near(target.b);
                            var pitch = options.filter(function (tone) { return tone.semitones() >= 28 && tone.semitones() <= 48 && tone.semitones() <= _this.outputEvent().getS().main().getPitch().semitones() - 10; })[0];
                            this_1.outputEvent().setB(pitch.group(this_1.outputEvent().duration()));
                        }
                        if (resolution.excludes((_l = inputEvent.getS().main()) === null || _l === void 0 ? void 0 : _l.getPitch().getTone()) ||
                            resolution.excludes((_m = inputEvent.getA().main()) === null || _m === void 0 ? void 0 : _m.getPitch().getTone()) ||
                            resolution.excludes((_o = inputEvent.getT().main()) === null || _o === void 0 ? void 0 : _o.getPitch().getTone()) ||
                            resolution.excludes((_p = inputEvent.getB().main()) === null || _p === void 0 ? void 0 : _p.getPitch().getTone())) {
                            return "continue";
                        }
                        if (inputEvent.getB().main() && !inputEvent.getB().main().getPitch().getTone().equals(resolution.bass())) {
                            return "continue";
                        }
                        if (previousChord.getInversion() === 2 && ((_r = (_q = this_1.previousPreviousOutputEvent()) === null || _q === void 0 ? void 0 : _q.getChord()) === null || _r === void 0 ? void 0 : _r.string()) === chord.string()) {
                            return "continue";
                        }
                        var quotas = resolution.getSeventh() ? [1, 1, 1, 1] : [2, 1, 2, 0];
                        var _loop_2 = function (part) {
                            var array = [resolution.getRoot(), resolution.getThird(), resolution.getFifth(), resolution.getSeventh()].filter(function (tone) { return tone !== undefined; });
                            var inversion = array.findIndex(function (tone) { var _a; return tone.equals((_a = _this.outputEvent().getPart(part).main()) === null || _a === void 0 ? void 0 : _a.getPitch().getTone()); });
                            if (inversion !== -1) {
                                --quotas[inversion];
                            }
                        };
                        for (var _i = 0, _w = ["s", "a", "t", "b"]; _i < _w.length; _i++) {
                            var part = _w[_i];
                            _loop_2(part);
                        }
                        if (resolution.getSeventh() === undefined) {
                            if (quotas[0] === 0) {
                                quotas[2] = 1;
                                if (quotas[2] === 0) {
                                    return "continue";
                                }
                            }
                            if (quotas[2] === 0) {
                                quotas[0] = 1;
                            }
                        }
                        if (quotas.some(function (quota) { return quota < 0; })) {
                            return "continue";
                        }
                        var permutations = void 0;
                        var ones = quotas.map(function (quota, inversion) { return quota === 1 ? resolution.at(inversion) : undefined; }).filter(function (tone) { return tone !== undefined; });
                        var a = void 0;
                        var t = void 0;
                        if (!defined.a && !defined.t) {
                            var two = resolution.at(quotas.findIndex(function (quota) { return quota === 2; }));
                            switch (ones.length) {
                                case 1:
                                    var permutation1 = {
                                        a: a = ones[0].near(target.a)[0],
                                        t: t = two.near(target.t)[0],
                                        score: this_1.score(a, t)
                                    };
                                    var permutation2 = {
                                        a: a = two.near(target.a)[0],
                                        t: t = ones[0].near(target.t)[0],
                                        score: this_1.score(a, t)
                                    };
                                    var permutation3 = {
                                        a: a = two.near(target.a)[0],
                                        t: t = two.near(target.t)[0],
                                        score: this_1.score(a, t)
                                    };
                                    permutations = [permutation1, permutation2, permutation3].sort(function (l, r) { return l.score - r.score; });
                                    break;
                                case 2:
                                    var permutation4 = {
                                        a: a = ones[0].near(target.a)[0],
                                        t: t = ones[1].near(target.t)[0],
                                        score: this_1.score(a, t)
                                    };
                                    var permutation5 = {
                                        a: a = ones[1].near(target.a)[0],
                                        t: t = ones[0].near(target.t)[0],
                                        score: this_1.score(a, t)
                                    };
                                    permutations = [permutation4, permutation5].sort(function (l, r) { return l.score - r.score; });
                                    break;
                                case 3:
                                    var permutation6 = {
                                        a: a = ones[0].near(target.a)[0],
                                        t: t = ones[1].near(target.t)[0],
                                        score: this_1.score(a, t)
                                    };
                                    var permutation7 = {
                                        a: a = ones[1].near(target.a)[0],
                                        t: t = ones[0].near(target.t)[0],
                                        score: this_1.score(a, t)
                                    };
                                    var permutation8 = {
                                        a: a = ones[1].near(target.a)[0],
                                        t: t = ones[2].near(target.t)[0],
                                        score: this_1.score(a, t)
                                    };
                                    var permutation9 = {
                                        a: a = ones[2].near(target.a)[0],
                                        t: t = ones[1].near(target.t)[0],
                                        score: this_1.score(a, t)
                                    };
                                    permutations = [permutation6, permutation7, permutation8, permutation9].sort(function (l, r) { return l.score - r.score; });
                                    break;
                            }
                        }
                        else if (defined.a && !defined.t) {
                            a = this_1.outputEvent().getA().main().getPitch();
                            if (ones.length === 1) {
                                permutations = [{
                                        a: a,
                                        t: t = ones[0].near(target.t)[0],
                                        score: this_1.score(a, t)
                                    }];
                            }
                            else {
                                permutations = [{
                                        a: a,
                                        t: t = ones[0].near(target.t)[0],
                                        score: this_1.score(a, t)
                                    }, {
                                        a: a,
                                        t: t = ones[1].near(target.t)[0],
                                        score: this_1.score(a, t)
                                    }];
                            }
                        }
                        else if (!defined.a && defined.t) {
                            t = this_1.outputEvent().getT().main().getPitch();
                            if (ones.length === 1) {
                                permutations = [{
                                        a: a = ones[0].near(target.a)[0],
                                        t: t,
                                        score: this_1.score(a, t)
                                    }];
                            }
                            else {
                                permutations = [{
                                        a: a = ones[0].near(target.a)[0],
                                        t: t,
                                        score: this_1.score(a, t)
                                    }, {
                                        a: a = ones[1].near(target.a)[0],
                                        t: t,
                                        score: this_1.score(a, t)
                                    }];
                            }
                        }
                        else {
                            permutations = [{
                                    a: a = this_1.outputEvent().getA().main().getPitch(),
                                    t: t = this_1.outputEvent().getT().main().getPitch(),
                                    score: this_1.score(a, t)
                                }];
                        }
                        for (var _x = 0, permutations_1 = permutations; _x < permutations_1.length; _x++) {
                            var permutation = permutations_1[_x];
                            if (permutation.score === Infinity) {
                                continue;
                            }
                            this_1.outputEvent().setA(permutation.a.group(this_1.outputEvent().duration()));
                            this_1.outputEvent().setT(permutation.t.group(this_1.outputEvent().duration()));
                            if (this_1.checkParallel("s", "a") ||
                                this_1.checkParallel("s", "t") ||
                                this_1.checkParallel("s", "b") ||
                                this_1.checkParallel("a", "t") ||
                                this_1.checkParallel("a", "b") ||
                                this_1.checkParallel("t", "b")) {
                                continue;
                            }
                            this_1.outputEvent().setChord(chord);
                            if (++this_1.getTime().event === this_1.getInput()[this_1.getTime().bar].length) {
                                this_1.getTime().event = 0;
                                ++this_1.getTime().bar;
                            }
                            return { value: void 0 };
                        }
                        return "continue";
                    };
                    var this_1 = this;
                    for (; this.outputEvent().map < chordOptions.length; ++this.outputEvent().map) {
                        var state_1 = _loop_1();
                        if (typeof state_1 === "object")
                            return state_1.value;
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
                };
                Piece.prototype.score = function (aPitch, tPitch) {
                    var _a, _b, _c, _d;
                    var s = this.outputEvent().getS().main().getPitch().semitones();
                    var a = aPitch.semitones();
                    var t = tPitch.semitones();
                    var b = this.outputEvent().getB().main().getPitch().semitones();
                    var previousA = (_b = (_a = this.previousOutputEvent()) === null || _a === void 0 ? void 0 : _a.getA().at(-1).getPitch()) !== null && _b !== void 0 ? _b : pitch_js_3.default.parse("D4");
                    var previousT = (_d = (_c = this.previousOutputEvent()) === null || _c === void 0 ? void 0 : _c.getT().at(-1).getPitch()) !== null && _d !== void 0 ? _d : pitch_js_3.default.parse("B3");
                    var aChange = Math.abs(a - previousA.semitones());
                    var tChange = Math.abs(t - previousT.semitones());
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
                    var sa = s - a;
                    var at = a - t;
                    var stdDev = Math.sqrt((sa * sa + at * at) / 2 - Math.pow((sa + at), 2) / 4);
                    var score = aChange + tChange + stdDev;
                    return score;
                };
                Piece.prototype.checkParallel = function (upper, lower) {
                    var previousEvent = this.previousOutputEvent();
                    if (previousEvent === undefined) {
                        return false;
                    }
                    var previousUpper = previousEvent.getPart(upper).at(-1).getPitch().semitones();
                    var previousLower = previousEvent.getPart(lower).at(-1).getPitch().semitones();
                    var currentUpper = this.outputEvent().getPart(upper).at(0).getPitch().semitones();
                    var currentLower = this.outputEvent().getPart(lower).at(0).getPitch().semitones();
                    var previousInterval = (previousUpper - previousLower) % 12;
                    var interval = (currentUpper - currentLower) % 12;
                    return (previousInterval === 0 && interval === 0 || previousInterval === 7 && interval === 7) && previousUpper !== currentUpper && previousLower !== currentLower;
                };
                Piece.prototype.getInput = function () {
                    return this.input;
                };
                Piece.prototype.setInput = function (input) {
                    this.input = input;
                    return this;
                };
                Piece.prototype.getOutput = function () {
                    return this.output;
                };
                Piece.prototype.setOutput = function (output) {
                    this.output = output;
                    return this;
                };
                Piece.prototype.getTime = function () {
                    return this.time;
                };
                Piece.prototype.setTime = function (time) {
                    this.time = time;
                    return this;
                };
                Piece.prototype.getMaxTime = function () {
                    return this.maxTime;
                };
                Piece.prototype.setMaxTime = function (maxTime) {
                    this.maxTime = maxTime;
                    return this;
                };
                Piece.prototype.getKey = function () {
                    return this.key;
                };
                Piece.prototype.setKey = function (key) {
                    this.key = key;
                    return this;
                };
                Piece.prototype.getDictionary = function () {
                    return this.dictionary;
                };
                Piece.prototype.setDictionary = function (dictionary) {
                    this.dictionary = dictionary;
                    return this;
                };
                Piece.prototype.string = function () {
                    return "[".concat(this.getOutput().map(function (bar) { return bar.map(function (event) { return event.getS().string().padEnd(8); }).join(" "); }).join("|"), "]\n[").concat(this.getOutput().map(function (bar) { return bar.map(function (event) { return event.getA().string().padEnd(8); }).join(" "); }).join("|"), "]\n[").concat(this.getOutput().map(function (bar) { return bar.map(function (event) { return event.getT().string().padEnd(8); }).join(" "); }).join("|"), "]\n[").concat(this.getOutput().map(function (bar) { return bar.map(function (event) { return event.getB().string().padEnd(8); }).join(" "); }).join("|"), "]\n[").concat(this.getOutput().map(function (bar) { return bar.map(function (event) { var _a; return (_a = event.getChord()) === null || _a === void 0 ? void 0 : _a.string().padEnd(8); }).join(" "); }).join("|"), "]");
                };
                return Piece;
            }());
            exports_12("default", Piece);
        }
    };
});
System.register("index", ["chord", "dictionary", "event", "group", "key", "note", "numeral", "piece", "pitch", "resolution", "tone", "util"], function (exports_13, context_13) {
    "use strict";
    var chord_js_2, dictionary_js_2, event_js_2, group_js_3, key_js_3, note_js_3, numeral_js_3, piece_js_1, pitch_js_4, resolution_js_2, tone_js_4, util_js_1;
    var __moduleName = context_13 && context_13.id;
    return {
        setters: [
            function (chord_js_2_1) {
                chord_js_2 = chord_js_2_1;
            },
            function (dictionary_js_2_1) {
                dictionary_js_2 = dictionary_js_2_1;
            },
            function (event_js_2_1) {
                event_js_2 = event_js_2_1;
            },
            function (group_js_3_1) {
                group_js_3 = group_js_3_1;
            },
            function (key_js_3_1) {
                key_js_3 = key_js_3_1;
            },
            function (note_js_3_1) {
                note_js_3 = note_js_3_1;
            },
            function (numeral_js_3_1) {
                numeral_js_3 = numeral_js_3_1;
            },
            function (piece_js_1_1) {
                piece_js_1 = piece_js_1_1;
            },
            function (pitch_js_4_1) {
                pitch_js_4 = pitch_js_4_1;
            },
            function (resolution_js_2_1) {
                resolution_js_2 = resolution_js_2_1;
            },
            function (tone_js_4_1) {
                tone_js_4 = tone_js_4_1;
            },
            function (util_js_1_1) {
                util_js_1 = util_js_1_1;
            }
        ],
        execute: function () {
            exports_13("Chord", chord_js_2.default);
            exports_13("Dict", dictionary_js_2.default);
            exports_13("Event", event_js_2.default);
            exports_13("Group", group_js_3.default);
            exports_13("Key", key_js_3.default);
            exports_13("Note", note_js_3.default);
            exports_13("Numeral", numeral_js_3.default);
            exports_13("Piece", piece_js_1.default);
            exports_13("Pitch", pitch_js_4.default);
            exports_13("Resolution", resolution_js_2.default);
            exports_13("Tone", tone_js_4.default);
            exports_13("Util", util_js_1.default);
        }
    };
});
