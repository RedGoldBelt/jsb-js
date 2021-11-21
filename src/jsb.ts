import * as T from "tone";

export namespace JSB {
    class Numeral {
        static NUM = ["i", "ii", "iii", "iv", "v", "vi", "vii"];

        deg;
        ton;

        constructor(deg: number, ton: boolean) { this.deg = deg; this.ton = ton; }

        static parse(string: string) { return new Numeral(Numeral.NUM.indexOf(string.toLowerCase()), string === string.toUpperCase()); }

        string() { return Numeral.NUM[this.deg][this.ton ? "toUpperCase" : "toLowerCase"](); }
    }

    class BaseNumeral extends Numeral {
        acc;

        constructor(acc: number, deg: number, ton: boolean) {
            super(deg, ton);
            this.acc = acc;
        }

        static parse(string: string) {
            const result = string.match(/(b|#|)(III|iii|VII|vii|II|ii|IV|iv|VI|vi|I|i|V|v)/);
            return new BaseNumeral(Tone.ACC.indexOf(result[1]), BaseNumeral.NUM.indexOf(result[2].toLowerCase()), result[2] === result[2].toUpperCase());
        }

        string() {
            return Tone.ACC[this.acc] + super.string();
        }
    }

    class Tone {
        static ACC = ["", "#", "x"];
        private static LETTER = ["C", "D", "E", "F", "G", "A", "B"];
        private static PITCH = [0, 2, 4, 5, 7, 9, 11];

        letter;
        acc;

        constructor(letter: number, acc: number) { this.letter = letter; this.acc = acc; }

        static parse(string: string) {
            const result = string.match(/([A-G])(bb|x|b|#|)/);
            return new Tone(Tone.LETTER.indexOf(result[1]), Tone.ACC.indexOf(result[2]));
        }

        pitch() { return Tone.PITCH[this.letter] + this.acc; }

        eq(tone: Tone) { return tone ? this.letter === tone.letter && this.acc === tone.acc : false; }

        alter(acc: number) { this.acc += acc; return this; }

        string() { return Tone.LETTER[this.letter] + Tone.ACC[this.acc]; }
    }

    Tone.ACC[-2] = "bb";
    Tone.ACC[-1] = "b";

    class Note {
        tone;
        oct;

        constructor(tone: Tone, oct: number) { this.tone = tone; this.oct = oct; }

        static parse(string: string) {
            const result = string.match(/([A-G])(bb|b|#|x|)([1-6])/);
            return new Note(Tone.parse(result[1] + result[2]), Number(result[3]));
        }

        pitch() { return this.tone.pitch() + 12 * this.oct; }

        near(tone: Tone) {
            const note1 = new Note(tone, this.oct - 1);
            const note2 = new Note(tone, this.oct);
            const note3 = new Note(tone, this.oct + 1);
            return [note1, note2, note3].sort((l, r) => Math.abs(this.pitch() - l.pitch()) - Math.abs(this.pitch() - r.pitch()));
        }

        string() { return this.tone.string() + this.oct; }
    }

    class Key {
        tone;
        ton;

        constructor(tone: Tone, tonality: boolean) { this.tone = tone; this.ton = tonality; }

        static parse(string: string) {
            const result = string.match(/(C|D|E|F|G|A|B)(bb|x|b|#|) (major|minor)/);
            return new Key(Tone.parse(result[1] + result[2]), result[3] === "major");
        }

        degree(deg: number, relPitch?: number) {
            deg %= 7;
            relPitch ??= (this.ton ? [0, 2, 4, 5, 7, 9, 11] : [0, 2, 3, 5, 7, 8, 10])[deg];
            const top = new Tone((this.tone.letter + deg) % 7, 0);
            top.acc = (relPitch - top.pitch() + this.tone.pitch() + 18) % 12 - 6;
            return top;
        }

        string() { return this.tone.string() + " " + (this.ton ? "major" : "minor"); }
    }

    type Alteration = "" | "7" | "o7";

    class Chord {
        private static INV = ["a", "b", "c", "d"];

        base;
        alt;
        inv;
        keyNumeral;

        constructor(base: BaseNumeral, alt: Alteration, inv: number, key: Numeral) {
            this.base = base;
            this.alt = alt;
            this.inv = inv;
            this.keyNumeral = key;
        }

        static parse(string: string) {
            if (string === "") return undefined;
            const result = string.match(/((b|#|)(III|iii|VII|vii|II|ii|IV|iv|VI|vi|I|i|V|v))(o7|7|)([a-d])?(\/((III|iii|VII|vii|II|ii|IV|iv|VI|vi|I|i|V|v)))?/);
            return new Chord(
                BaseNumeral.parse(result[1]),
                result[4] as Alteration,
                (result[5] ? Chord.INV.indexOf(result[5]) : 0),
                result[6] ? Numeral.parse(result[7]) : undefined
            );
        }

        static all(string: string) {
            const c = Chord.parse(string);
            const a = [(c.inv = 2, c.stringFull()), (c.inv = 1, c.stringFull()), (c.inv = 0, c.stringFull())];
            if (c.alt) a.unshift((c.inv = 3, c.stringFull()));
            return a;
        }

        setInv(inv: number) {
            this.inv = inv;
            return this;
        }

        resolve(key: Key) {
            key = new Key(key.degree(this.keyNumeral.deg), this.keyNumeral.ton)
            const rootPitch = key.degree(this.base.deg).alter(this.base.acc).pitch() - key.degree(0).pitch();
            const third = key.degree(this.base.deg + 2, rootPitch + (this.base.ton ? 4 : 3));
            let fifth: Tone;
            let seventh: Tone;

            switch (this.alt) {
                case "":
                    fifth = key.degree(this.base.deg + 4);
                    break;
                case "o7":
                    fifth = key.degree(this.base.deg + 4, rootPitch + 6);
                    seventh = key.degree(this.base.deg + 6, rootPitch + 9);
                    break;
                case "7":
                    fifth = key.degree(this.base.deg + 4, rootPitch + 7);
                    seventh = key.degree(this.base.deg + 6);
                    break;
            }
            return new Resolution(key.degree(this.base.deg).alter(this.base.acc), third, fifth, seventh, this.inv);
        }

        prog(dict: any): Chord[] {
            const SPEC = dict["SPEC_" + this.keyNumeral.string()];
            const SPEC_OPT = SPEC[this.string()].flat().map(Chord.parse);
            const COM = this.keyNumeral.ton ? dict.COM_MAJ : dict.COM_MIN;
            const COM_OPT = COM[this.string()].flat().map((string: string) => {
                const c = Chord.parse(string);
                c.keyNumeral = this.keyNumeral;
                return c;
            });
            return SPEC_OPT.concat(COM_OPT);
        }

        string() { return this.base ? this.base.string() + this.alt + (this.inv ? Chord.INV[this.inv] : "") : null; }

        stringFull() { return this.string() + (this.keyNumeral ? "/" + this.keyNumeral.string() : "") }
    }

    class Resolution {
        inv;

        constructor(root: Tone, third: Tone, fifth: Tone, seventh: Tone, inv: number) {
            this[0] = root;
            this[1] = third;
            this[2] = fifth;
            this[3] = seventh;
            this.inv = inv;
        }

        *[Symbol.iterator]() { for (let i = 0; i < 4; ++i) yield this[i]; }

        excl(testTone: Tone) { return testTone ? Array.from(this).filter(tone => tone).every(tone => !tone?.eq(testTone)) : false; }

        string() { return Array.from(this).filter(tone => tone).map((tone, inv) => inv === this.inv ? "(" + tone.string() + ")" : tone.string()).join(" "); }
    }

    class Index {
        s: Note;
        a: Note;
        t: Note;
        b: Note;
        d: number;
        c: Chord;
        map: number = 0;

        constructor(d: number) {
            this.d = d;
        }
    }

    interface Bar extends Array<Index> {
        at(position: number): Index;
    }

    interface Time {
        bar: number;
        i: number;
    }

    export class Piece {
        in: Bar[] = [];
        out: Bar[] = [];

        private t: Time;
        private key: Key;
        private cad: Time[];
        private _x: Index;
        private res: Resolution;

        load(key: string, s: string, a?: string, t?: string, b?: string) {
            this.key = Key.parse(key);
            this.in = [];
            this.cad = [];
            this.loadPart(s, "s");
            this.loadPart(a, "a");
            this.loadPart(t, "t");
            this.loadPart(b, "b");
            return this;
        }

        private loadPart(string: string, part: string) {
            if (string) {
                const split = string.split(/[[|\]]/).filter(bar => bar).map(bar => bar.split(" ").filter(note => note));
                let n = Note.parse("C4");
                for (let bar = 0; bar < split.length; ++bar) {
                    this.in[bar] ??= []
                    this.out[bar] = [];
                    for (let i = 0; i < split[bar].length; ++i) {
                        const result = split[bar][i].match(/([A-G](bb|b|#|x|)([1-6]?))([_\/\.]*)(@?)/);
                        const d = result[4].split("").reduce((l, r) => l *= { "/": 0.5, ".": 1.5, "_": 2 }[r], 1);
                        n = result[3] ? Note.parse(result[1]) : n.near(Tone.parse(result[1]))[0];
                        this.in[bar][i] ??= new Index(d);
                        this.in[bar][i][part] = n;
                        this.out[bar][i] = new Index(d);
                        if (result[5]) {
                            this.cad.push({ bar: bar, i: i });
                        }
                    }
                }
            }
        }

        private bar() { return this.in[this.t.bar]; }

        private i() { return this.bar()[this.t.i]; }

        private _i() { return this.t.i ? this.bar()[this.t.i - 1] : this.in[this.t.bar - 1]?.at(-1); }

        private __i() {
            let i = this.t.i;
            let bar = this.t.bar;
            if (--i < 0) {
                if (--bar < 0) return undefined;
                i = this.in[bar].length - 1;
            }
            if (--i < 0) {
                if (--bar < 0) return undefined;
                i = this.in[bar].length - 1;
            }
            return this.in[bar][i];
        }

        private i_() {
            if (++this.t.i === this.bar().length) {
                this.t.i = 0;
                ++this.t.bar;
            }
        }

        private x() { return this.out[this.t.bar][this.t.i]; }

        harmonise(dict: any) {
            console.groupCollapsed();
            console.time("Harmonisation");

            for (this.t = { bar: 0, i: 0 }; !(this.t.bar === this.in.length && this.t.i === 0);) {
                if (this.t.bar < 0) {
                    console.info("%cFailed!", "background-color: #ff0000;");
                    return this;
                }
                this.assign(dict);
            }
            console.info("%cSuccess!", "background-color: #00e000;");
            console.timeEnd("Harmonisation");
            for (const part of ["s", "a", "t", "b", "c"]) {
                console.info(this.string(part));
            }
            console.groupEnd();
            return this;
        }

        private assign(dict: any) {
            const _c = this._i()?.c ?? new Chord(null, null, null, new Numeral(0, true));
            const cOpt = _c.prog(dict);

            for (; this.i().map < cOpt.length; ++this.i().map) {
                const c = cOpt[this.i().map];
                this.res = c.resolve(this.key);

                // REJECT: INVALID CADENCE
                if (this.cad.some(t => this.t.bar === t.bar && this.t.i === t.i && !["I", "i", "V"].includes(c.string()))) {
                    console.info(`%cRejected '${c.stringFull()}': Invalid cadence`, "color: #9c7c00;");
                    continue;
                }

                // REJECT: PARTS DO NOT FIT
                if (this.res.excl(this.i()?.s.tone) || this.res.excl(this.i().a?.tone) || this.res.excl(this.i().t?.tone) || this.res.excl(this.i().b?.tone)) {
                    // console.info(`%cRejected '${c.stringFull()}': Parts do not fit`, "color: #9c7c00;");
                    continue;
                }

                // REJECT: WRONG INVERSION
                if (this.i().b && this.i().b.tone.eq(this.res[this.res.inv])) {
                    console.info(`%cRejected '${c.stringFull()}': Wrong inversion`, "color: #9c7c00;");
                    continue;
                }

                // REJECT: Invalid second inversion chord
                if (_c.inv === 2 && this.__i() && this.__i().c.stringFull() === c.stringFull()) {
                    console.info(`%cRejected '${c.stringFull()}': Invalid second inversion chord`, "color: #9c7c00;");
                    continue;
                }

                // TEST VIABILITY
                this._x = this.t.i ? this.out[this.t.bar][this.t.i - 1] : this.out[this.t.bar - 1]?.at(-1);;

                if (!this._x) {
                    this._x = new Index(null);
                    this._x.s = Note.parse("G4");
                    this._x.a = Note.parse("D4");
                    this._x.t = Note.parse("B3");
                    this._x.b = Note.parse("G3");
                }
                this.x().s = this.i().s;
                this.x().a = this.i().a;
                this.x().t = this.i().t;
                this.x().b = this.i().b ?? this._x.b.near(this.res[this.res.inv]).filter((note: Note) => note.pitch() >= 28 && note.pitch() <= 48 && note.pitch() <= this.x().s.pitch() - 7)[0];
                this.x().c = c;

                const q = this.res[3] ? [1, 1, 1, 1] : [2, 1, 2, 0];

                for (const part of ["s", "a", "t", "b"]) {
                    if (this.x()[part]) --q[Array.from(this.res).findIndex((tone: Tone) => tone.eq(this.x()[part].tone))];
                }
                if (!this.res[3]) {
                    if (q[0] === 0) q[2] = 1;
                    if (q[2] === 0) q[0] = 1;
                }

                // REJECT: TOO MANY ROOTS
                if (q[0] < 0) {
                    this.clear();
                    console.info(`%cRejected '${c.stringFull()}': Too many roots`, "color: #9c7c00;");
                    continue;
                }

                // REJECT: TOO MANY THIRDS
                if (q[1] < 0) {
                    this.clear();
                    console.info(`%cRejected '${c.stringFull()}': Too many thirds`, "color: #9c7c00;");
                    continue;
                }

                // REJECT: TOO MANY FIFTHS
                if (q[2] < 0) {
                    this.clear();
                    console.info(`%cRejected '${c.stringFull()}': Too many fifths`, "color: #9c7c00;");
                    continue;
                }

                // REJECT: TOO MANY SEVENTHS
                if (q[1] < 0) {
                    this.clear();
                    console.info(`%cRejected '${c.stringFull()}': Too many sevenths`, "color: #9c7c00;");
                    continue;
                }

                // REJECT: S-B PARALLEL
                if (this.parallel("s", "b")) {
                    this.clear();
                    console.info(`%cRejected '${c.stringFull()}': Soprano and bass in parallel`, "color: #9c7c00;");
                    continue;
                }

                const ones = q.map((x, i) => x === 1 ? i : null).filter(i => i !== null);
                const two = q.findIndex(x => x === 2);

                const perms = this.perm(ones, two);

                for (const perm of perms) {
                    this.x().a = this._x.a.near(this.res[perm[0]])[0];
                    this.x().t = this._x.t.near(this.res[perm[1]]).filter((note: Note) => note.pitch() >= this.x().b.pitch())[0];

                    // REJECT: PARALLEL
                    if (!(this.t.bar === 0 && this.t.i === 0) && (this.parallel("s", "a") || this.parallel("s", "t") || this.parallel("a", "t") || this.parallel("a", "b") || this.parallel("t", "b"))) {
                        continue;
                    }

                    // ACCEPT
                    this.i().c = c;
                    this.i_();
                    console.info(`%cAccepted '${c.stringFull()} at ${this.t.bar}, ${this.t.i}'`, "color: #00e000;");
                    return;
                }

                // REJECT: NO GOOD REALISATION
                this.clear();
                console.info(`%cRejected '${c.stringFull()}': No good realisation`, "color: #9c7c00;");
                continue;
            }

            this.revert();
            console.info(`%cReverted '${_c?.stringFull()}': No good progressions available`, "color: #ff0000;");
            return;
        }

        private perm(ones: number[], two: number) {
            switch (ones.length as 1 | 2 | 3) {
                case 1:
                    return [
                        [ones[0], two, this.score(ones[0], two)],
                        [two, ones[0], this.score(two, ones[0])],
                        [two, two, this.score(two, two)]
                    ].filter(comb => comb[2]).sort((l, r) => l[2] - r[2]);
                case 2:
                    return [
                        [ones[0], ones[1], this.score(ones[0], ones[1])],
                        [ones[1], ones[0], this.score(ones[1], ones[0])]
                    ].filter(comb => comb[2]).sort((l, r) => l[2] - r[2]);
                case 3:
                    return [
                        [ones[0], ones[1], this.score(ones[0], ones[1])],
                        [ones[1], ones[0], this.score(ones[1], ones[0])],
                        [ones[1], ones[2], this.score(ones[1], ones[2])],
                        [ones[2], ones[1], this.score(ones[2], ones[1])]
                    ].filter(comb => comb[2]).sort((l, r) => l[2] - r[2]);
            }
        }

        private score(aInv: number, tInv: number) {
            const s = this.x().s.pitch();
            const b = this.x().b.pitch();
            const a = this._x.a.near(this.res[aInv])[0].pitch();
            const t = this._x.t.near(this.res[tInv]).filter((note: Note) => note.pitch() >= b)[0].pitch();
            const aChange = Math.abs(a - this._x.a.pitch());
            const tChange = Math.abs(t - this._x.t.pitch());
            if (aChange > 7) return null;
            if (tChange > 7) return null;
            if (a > s) return null;
            if (t > a) return null;
            if (b > t) return null;
            return aChange + tChange + 1;
        }

        private parallel(u: string, l: string) {
            const _int = (this._x[u].pitch() - this._x[l].pitch()) % 12;
            const int = (this.x()[u].pitch() - this.x().b.pitch()) % 12;
            return (_int === 0 && int === 0 || _int === 7 && int === 7) && this._x[u].pitch() !== this.x()[u].pitch();
        }

        private revert() {
            this.i().map = 0;
            if (--this.t.i < 0) {
                if (--this.t.bar >= 0) {
                    this.t.i = this.bar().length - 1;
                }
            }
            if (this.t.bar >= 0) {
                ++this.i().map;
            }
        }

        private clear() {
            this.x().s = undefined;
            this.x().a = undefined;
            this.x().t = undefined;
            this.x().b = undefined;
            this.x().c = undefined;
        }

        play(tempo: number) {
            const s = new T.Synth().toDestination();
            const a = new T.Synth().toDestination();
            const t = new T.Synth().toDestination();
            const b = new T.Synth().toDestination();
            let total = 0;
            for (this.t = { bar: 0, i: 0 }; !(this.t.bar === this.in.length && this.t.i === 0);) {
                const x = this.x();
                s.triggerAttackRelease(x.s.string(), 0.95 * tempo * x.d, total);
                a.triggerAttackRelease(x.a.string(), 0.95 * tempo * x.d, total);
                t.triggerAttackRelease(x.t.string(), 0.95 * tempo * x.d, total);
                b.triggerAttackRelease(x.b.string(), 0.95 * tempo * x.d, total);
                total += tempo * x.d;
                this.i_();
            }
        }

        private string(part: string) {
            return "[" + this.out.map(bar => bar.map(i => i[part].string().padEnd(6)).join(" ")).join("|") + "]";
        }
    }

    export const DICT_FULL: any = {
        COM_MAJ: {
            null: ["I", "V", "IV", "ii", "vi", "iii"],

            "I": [Chord.all("iii7"), Chord.all("iii"), Chord.all("vi7"), Chord.all("vi"), Chord.all("ii7"), Chord.all("ii"), Chord.all("IV"), "viib", Chord.all("V"), Chord.all("I")],
            "Ib": ["IV", "ii", "V7d", "Vc", "vi", "Ic", "I"],
            "Ic": ["V7d", "V7", "V"],

            "ii": ["Ic", "V", "vi", "iii", "IV"],
            "iib": ["Ic", "V"],
            "iic": [],

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

            "IV": ["viio", "iii", "I", "V", "ii"],
            "IVb": ["viio", "Ic", "I"],
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
        COM_MIN: {
            null: ["i", "iv", "V"],

            "i": ["VI", Chord. all("V7"), Chord.all("V"), "#viib"],
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
        SPEC_I: {
            null: [],

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

            "V": ["V7c/V"],
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
        SPEC_V: {
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
            "V7b": [],
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

            "vii7": [],
            "vii7b": [],
            "vii7c": [],
            "vii7d": [],

            "viio7": [],
            "viio7b": [],
            "viio7c": [],
            "viio7d": []
        }
    }

    export const DICT_PRIMARY_a_b: any = {
        COM_MAJ: {
            null: ["Ib", "I", "IVb", "IV", "Vb", "V"],

            "I": ["IVb", "IV", "Vb", "V", "Ib", "I"],
            "Ib": ["IV", "V", "I"],

            "IV": ["V", "Ib", "I", "IVb"],
            "IVb": ["V", "I", "IV"],

            "V": ["I", "Ib", "IV", "Vb"],
            "Vb": ["I", "V"]
        },
        SPEC_I: {
            null: [],

            "I": [],
            "Ib": [],

            "IV": [],
            "IVb": [],

            "V": [],
            "Vb": [],
        }
    }
}
