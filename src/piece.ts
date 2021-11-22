import Chord from "./chord.js";
import Key from "./key.js";
import Note from "./note.js";
import Numeral from "./numeral.js";
import Resolution from "./resolution.js";
import Slice from "./slice.js";
import Tone from "./tone.js";
import { Bar, Config as Config, DICTIONARY_FULL as DICTIONARY_FULL, Inversion, Part, Permutation, Time } from "./util.js";

export class Piece {
    in: Bar[] = [];
    out: Bar[] = [];

    private time: Time = { bar: 0, slice: 0 };
    private key: Key;
    private resolution: Resolution = new Resolution(Tone.parse("C"), Tone.parse("C"), Tone.parse("C"), Tone.parse("C"), 0); // Dummy resolution
    private config: Config = {
        dictionary: DICTIONARY_FULL,
        debug: false
    }

    constructor(key: string, s: string, a?: string, t?: string, b?: string) {
        this.key = Key.parse(key);
        this.in = [];
        this.load(s, "s");
        if (a) this.load(a, "a");
        if (t) this.load(t, "t");
        if (b) this.load(b, "b");
        return this;
    }

    private load(string: string, part: Part) {
        const split = string.split(/[[|\]]/).filter(bar => bar !== "").map(bar => bar.split(" ").filter(note => note !== ""));

        let note = Note.parse("C4");

        for (let bar = 0; bar < split.length; ++bar) {
            this.in[bar] ??= []
            this.out[bar] = [];

            for (let slice = 0; slice < split[bar].length; ++slice) {
                const result = split[bar][slice].match(/^([A-G](bb|b|#|x|)([1-6]?))([_\/\.]*)(@?)$/);
                if (result === null) throw new Error(`Could not parse annotated note '${split[bar][slice]}'`);

                note = result[3] ? Note.parse(result[1]) : note.near(Tone.parse(result[1]))[0];

                let duration = 1;
                for (const modifier of result[4]) {
                    switch (modifier) {
                        case "/": duration /= 2; break;
                        case ".": duration *= 1.5; break;
                        case "_": duration *= 2; break;
                    }
                }

                this.in[bar][slice] ??= new Slice(duration, result[5] === "@");
                this.in[bar][slice][part] = note;

                this.out[bar][slice] ??= new Slice(duration, result[5] === "@");
            }
        }
    }

    private bar() {
        return this.in[this.time.bar];
    }

    private previousPreviousInSlice() {
        let { slice, bar } = this.time;
        if (--slice < 0) {
            if (--bar < 0) {
                return undefined;
            }
            slice = this.in[bar].length - 1;
        }
        if (--slice < 0) {
            if (--bar < 0) {
                return undefined;
            }
            slice = this.in[bar].length - 1;
        }
        return this.in[bar][slice];
    }

    private previousInSlice() {
        let { slice, bar } = this.time;
        if (--slice < 0) {
            if (--bar < 0) {
                return undefined;
            }
            slice = this.in[bar].length - 1;
        }
        return this.in[bar][slice];
    }

    private inSlice() {
        return this.bar()[this.time.slice];
    }

    private incrementInSlice() {
        if (++this.time.slice === this.bar().length) {
            this.time.slice = 0;
            ++this.time.bar;
        }
    }

    private previousOutSlice() {
        let { slice, bar } = this.time;
        if (--slice < 0) {
            if (--bar < 0) {
                return undefined;
            }
            slice = this.out[bar].length - 1;
        }
        return this.out[bar][slice];
    }

    private outSlice() { return this.out[this.time.bar][this.time.slice]; }

    harmonise(config: Config = {}) {
        this.config = {
            dictionary: config.dictionary ?? this.config.dictionary,
            debug: config.debug ?? this.config.debug
        }

        console.groupCollapsed();
        console.time("Time");

        for (this.time = { bar: 0, slice: 0 }; !(this.time.bar === this.in.length && this.time.slice === 0);) {
            if (this.time.bar < 0) {
                console.timeEnd("Time");
                console.info("Failed to harmonise");
                return this;
            }
            this.step();
        }

        console.timeEnd("Time");
        for (const part of ["s", "a", "t", "b", "chord"] as (Part | "chord")[]) {
            console.info(this.string(part));
        }
        console.groupEnd();
        return this;
    }

    private step() {
        const previousChord = this.previousInSlice()?.chord ?? new Chord(null, "", 0, new Numeral(0, 0, true));
        const chordOptions = previousChord.progression(this.config.dictionary).filter(chord => !this.inSlice().cadence || ["I", "i", "V"].includes(chord.string()));

        for (; this.inSlice().map < chordOptions.length; ++this.inSlice().map) {
            const chord = chordOptions[this.inSlice().map];
            this.resolution = chord.resolve(this.key);

            // REJECT: PARTS DO NOT FIT
            if (this.partsUnfit()) {
                if (this.config.debug) {
                    //console.info(`Rejected '${chord.stringFull()}': Parts do not fit`);
                }
                continue;
            }

            // REJECT: WRONG INVERSION
            if (this.inSlice().b?.tone.equals(this.resolution.at(this.resolution.inversion))) {
                if (this.config.debug) {
                    console.info(`Rejected '${chord.stringFull()}': Wrong inversion`);
                }
                continue;
            }

            // REJECT: Invalid second inversion chord
            if (previousChord.inversion === 2 && this.previousPreviousInSlice()?.chord?.stringFull() === chord.stringFull()) {
                if (this.config.debug) {
                    console.info(`Rejected '${chord.stringFull()}': Invalid second inversion chord`);
                }
                continue;
            }

            // TEST VIABILITY
            this.outSlice().s = this.inSlice().s;
            this.outSlice().a = this.inSlice().a;
            this.outSlice().t = this.inSlice().t;
            this.outSlice().b = this.inSlice().b ?? (this.previousOutSlice()?.b ?? Note.parse("Eb3")).near(this.resolution.at(this.resolution.inversion)).filter((note: Note) => note.pitch() >= 28 && note.pitch() <= 48 && note.pitch() <= (this.outSlice().s as Note).pitch() - 10)[0];
            this.outSlice().chord = chord;

            const quotas = this.resolution[3] !== null ? [1, 1, 1, 1] : [2, 1, 2, 0];

            for (const part of ["s", "a", "t", "b"] as Part[]) {
                --quotas[this.resolution.array().findIndex((tone: Tone) => tone.equals(this.outSlice()[part]?.tone))];
            }

            if (this.resolution[3] === null) {
                if (quotas[0] === 0) quotas[2] = 1;
                if (quotas[2] === 0) quotas[0] = 1;
            }

            // REJECT: TOO MANY ROOTS
            if (quotas[0] < 0) {
                this.clear();
                if (this.config.debug) {
                    console.info(`Rejected '${chord.stringFull()}': Too many roots`);
                }
                continue;
            }

            // REJECT: TOO MANY THIRDS
            if (quotas[1] < 0) {
                this.clear();
                if (this.config.debug) {
                    console.info(`Rejected '${chord.stringFull()}': Too many thirds`);
                }
                continue;
            }

            // REJECT: TOO MANY FIFTHS
            if (quotas[2] < 0) {
                this.clear();
                if (this.config.debug) {
                    console.info(`Rejected '${chord.stringFull()}': Too many fifths`);
                }
                continue;
            }

            // REJECT: TOO MANY SEVENTHS
            if (quotas[1] < 0) {
                this.clear();
                if (this.config.debug) {
                    console.info(`Rejected '${chord.stringFull()}': Too many sevenths`);
                }
                continue;
            }

            // REJECT: S-B PARALLEL
            if (!(this.time.bar === 0 && this.time.slice === 0) && this.parallel("s", "b")) {
                this.clear();
                if (this.config.debug) {
                    console.info(`Rejected '${chord.stringFull()}': Soprano and bass in parallel`);
                }
                continue;
            }

            if (this.config.debug) {
                console.info(`Trying '${chord.stringFull()}'`);
            }

            const ones = quotas.map((quota, inversion) => quota === 1 ? inversion : null).filter(inversion => inversion !== null) as Inversion[];
            const two = quotas.findIndex(quota => quota === 2) as Inversion | -1;

            const permutations = this.permutation(ones, two);

            for (const permutation of permutations) {

                // REJECT: BAD REALISATION
                if (permutation.score === Infinity) {
                    continue;
                }

                this.outSlice().a = (this.previousOutSlice()?.a ?? Note.parse("D4")).near(this.resolution.at(permutation.altoInversion))[0];
                this.outSlice().t = (this.previousOutSlice()?.t ?? Note.parse("B3")).near(this.resolution.at(permutation.tenorInversion)).filter((note: Note) => note.pitch() >= (this.outSlice().b as Note).pitch())[0];

                // REJECT: PARALLEL PARTS
                if (!(this.time.bar === 0 && this.time.slice === 0) && (this.parallel("s", "a") || this.parallel("s", "t") || this.parallel("a", "t") || this.parallel("a", "b") || this.parallel("t", "b"))) {
                    if (this.config.debug) {
                        console.info(`|   Rejected permutation '${(this.outSlice().s as Note).string()} ${(this.outSlice().a as Note).string()} ${(this.outSlice().t as Note).string()} ${(this.outSlice().b as Note).string()}': Parallel parts`);
                    }
                    continue;
                }

                // ACCEPT
                this.inSlice().chord = chord;
                if (this.config.debug) {
                    console.info(`|   Accepted permutation '${this.outSlice().s?.string()} ${this.outSlice().a?.string()} ${this.outSlice().t?.string()} ${this.outSlice().b?.string()}'`);
                    console.info(`Accepted '${chord.stringFull()}' (Bar ${this.time.bar + 1}, Chord ${this.time.slice + 1})`);
                }
                this.incrementInSlice();
                return;
            }

            // REJECT: NO GOOD REALISATION
            this.clear();
            if (this.config.debug) {
                console.info(`Rejected '${chord.stringFull()}': No good realisation`);
            }
            continue;
        }

        this.revert();
        if (this.config.debug) {
            console.info(`Reverted '${previousChord?.stringFull()}': No good progressions available`);
        }
        return;
    }

    private partsUnfit() {
        if (this.resolution.excludes(this.inSlice().s?.tone)) {
            return true;
        }
        if (this.resolution.excludes(this.inSlice().a?.tone)) {
            return true;
        }
        if (this.resolution.excludes(this.inSlice().t?.tone)) {
            return true;
        }
        if (this.resolution.excludes(this.inSlice().b?.tone)) {
            return true;
        }
        return false;
    }

    private permutation(ones: Inversion[], two: Inversion | -1) {
        switch (ones.length as 1 | 2 | 3) {
            case 1:
                two = two as Inversion;
                const permutation1: Permutation = {
                    altoInversion: ones[0],
                    tenorInversion: two,
                    score: this.score(ones[0], two)
                };
                const permutation2: Permutation = {
                    altoInversion: two,
                    tenorInversion: ones[0],
                    score: this.score(two, ones[0])
                };
                const permutation3: Permutation = {
                    altoInversion: two,
                    tenorInversion: two,
                    score: this.score(two, two)
                };
                return [permutation1, permutation2, permutation3].sort((l, r) => l.score - r.score);
            case 2:
                const permutation4: Permutation = {
                    altoInversion: ones[0],
                    tenorInversion: ones[1],
                    score: this.score(ones[0], ones[1])
                };
                const permutation5: Permutation = {
                    altoInversion: ones[1],
                    tenorInversion: ones[0],
                    score: this.score(ones[1], ones[0])
                };
                return [permutation4, permutation5].sort((l, r) => l.score - r.score);
            case 3:
                const permutation6: Permutation = {
                    altoInversion: ones[0],
                    tenorInversion: ones[1],
                    score: this.score(ones[0], ones[1])
                };
                const permutation7: Permutation = {
                    altoInversion: ones[1],
                    tenorInversion: ones[0],
                    score: this.score(ones[1], ones[0])
                };
                const permutation8: Permutation = {
                    altoInversion: ones[1],
                    tenorInversion: ones[2],
                    score: this.score(ones[1], ones[2])
                };
                const permutation9: Permutation = {
                    altoInversion: ones[2],
                    tenorInversion: ones[1],
                    score: this.score(ones[2], ones[1])
                };
                return [permutation6, permutation7, permutation8, permutation9].sort((l, r) => l.score - r.score);
        }
    }

    private score(altoInversion: Inversion, tenorInversion: Inversion) {
        const previousA = this.previousOutSlice()?.a ?? Note.parse("D4");
        const previousT = this.previousOutSlice()?.t ?? Note.parse("B3");
        const s = (this.outSlice().s as Note).pitch();
        const b = (this.outSlice().b as Note).pitch();
        const aNote = previousA.near(this.resolution.at(altoInversion))[0];
        const a = aNote.pitch();
        const tNote = previousT.near(this.resolution.at(tenorInversion)).filter((note: Note) => note.pitch() >= b)[0];
        const t = tNote.pitch();
        const aChange = Math.abs(a - previousA.pitch());
        const tChange = Math.abs(t - previousT.pitch());

        let reason = "";

        if (aChange > 7) {
            reason = "Alto too disjunct";
        } else if (tChange > 7) {
            reason = "Tenor too disjunct";
        } else if (a > s) {
            reason = "Alto above soprano";
        } else if (t > a) {
            reason = "Tenor above alto";
        } else if (b > t) {
            reason = "Base above tenor";
        } else if (a > 64) {
            reason = "Alto too high";
        } else if (a < 43) {
            reason = "Alto too low";
        } else if (t < 36) {
            reason = "Tenor too low";
        } else if (t > 47) {
            reason = "Tenor too high";
        }

        if (reason !== "") {
            if (this.config.debug) {
                console.info(`|   Rejected permutation '${(this.outSlice().s as Note).string()} ${aNote.string()} ${tNote.string()} ${(this.outSlice().b as Note).string()}': ${reason}`);
            }
            return Infinity;
        }
        if (this.config.debug) {
            console.info(`|   Permutation '${(this.outSlice().s as Note).string()} ${aNote.string()} ${tNote.string()} ${(this.outSlice().b as Note).string()}' scores ${aChange + tChange}`)
        }
        return aChange + tChange;
    }

    private parallel(upper: Part, lower: Part) {
        const previousSlice = this.previousOutSlice() as Slice;
        const slice = this.outSlice() as Slice;
        const previousInterval = ((previousSlice[upper] as Note).pitch() - (previousSlice[lower] as Note).pitch()) % 12;
        const interval = ((slice[upper] as Note).pitch() - (slice[lower] as Note).pitch()) % 12;
        return (previousInterval === 0 && interval === 0 || previousInterval === 7 && interval === 7) && (previousSlice[upper] as Note).pitch() !== (slice[upper] as Note).pitch();
    }

    private revert() {
        this.inSlice().map = 0;
        if (--this.time.slice < 0) {
            if (--this.time.bar >= 0) {
                this.time.slice = this.bar().length - 1;
            }
        }
        if (this.time.bar >= 0) {
            ++this.inSlice().map;
        }
    }

    private clear() {
        this.outSlice().s = undefined;
        this.outSlice().a = undefined;
        this.outSlice().t = undefined;
        this.outSlice().b = undefined;
        this.outSlice().chord = undefined;
    }

    private string(part: Part | "chord") {
        return "[" + this.out.map(bar => bar.map(slice => slice[part]?.string().padEnd(6)).join(" ")).join("|") + "]";
    }
}
