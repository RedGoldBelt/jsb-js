// import * as T from "tone";
let T: any;
import Chord from "./chord.js";
import Key from "./key.js";
import Note from "./note.js";
import Numeral from "./numeral.js";
import Resolution from "./resolution.js";
import Slice from "./slice.js";
import Tone from "./tone.js";
import { Bar, Time } from "./util.js";

export class Piece {
    in: Bar[] = [];
    out: Bar[] = [];

    private t: Time;
    private key: Key;
    private cad: Time[];
    private _x: Slice;
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
                    this.in[bar][i] ??= new Slice(d);
                    this.in[bar][i][part] = n;
                    this.out[bar][i] = new Slice(d);
                    if (result[5]) {
                        this.cad.push({ bar: bar, i: i });
                    }
                }
            }
        }
    }

    private bar() { return this.in[this.t.bar]; }

    private i() { return this.bar()[this.t.i]; }

    private _i() { return this.t.i ? this.bar()[this.t.i - 1] : this.in[this.t.bar - 1]?.[this.in[this.t.bar - 1].length - 1]; }

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
            this._x = this.t.i ? this.out[this.t.bar][this.t.i - 1] : this.out[this.t.bar - 1]?.[this.out[this.t.bar - 1].length - 1];;

            if (!this._x) {
                this._x = new Slice(null);
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
