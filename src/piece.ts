import Chord from "./chord.js";
import * as DICTIONARY from "./dictionary.js";
import Key from "./key.js";
import Note from "./note.js";
import Numeral from "./numeral.js";
import Resolution from "./resolution.js";
import Event from "./event.js";
import Tone from "./tone.js";
import { Bar, Config, Inversion, Part, Permutation, Time } from "./util.js";

export default class Piece {
    in: Bar[] = [];
    out: Bar[] = [];

    private time: Time = { bar: 0, event: 0 };
    private key: Key;
    private resolution: Resolution = new Resolution(Tone.parse("C"), Tone.parse("C"), Tone.parse("C"), Tone.parse("C"), 0); // Dummy resolution
    private config: Config = {
        dictionary: DICTIONARY.FULL,
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

        let previousNote = Note.parse("C4");
        let previousInEvent: Event | undefined = undefined;
        let previousOutEvent: Event | undefined;

        for (let bar = 0; bar < split.length; ++bar) {
            this.in[bar] ??= []
            this.out[bar] = [];

            for (let event = 0; event < split[bar].length; ++event) {
                const result = split[bar][event].match(/^([A-G](bb|b|#|x|)([1-6]?))([_\/\.]*)(@?)$/);
                if (result === null) throw new Error(`Could not parse annotated note '${split[bar][event]}'`);

                previousNote = result[3] ? Note.parse(result[1]) : previousNote.near(Tone.parse(result[1]))[0];

                let duration = 1;
                for (const modifier of result[4]) {
                    switch (modifier) {
                        case "/": duration /= 2; break;
                        case ".": duration *= 1.5; break;
                        case "_": duration *= 2; break;
                    }
                }

                previousInEvent = this.in[bar][event] ??= new Event(previousInEvent, duration, result[5] === "@");
                this.in[bar][event][part] = previousNote;

                previousOutEvent = this.out[bar][event] ??= new Event(previousOutEvent, duration, result[5] === "@");
            }
        }
    }

    private get inEvent() {
        return this.in[this.time.bar][this.time.event];
    }

    private get outEvent() {
        return this.out[this.time.bar][this.time.event];
    }

    harmonise(config: Config = {}) {
        this.config = {
            dictionary: config.dictionary ?? this.config.dictionary,
            debug: config.debug ?? this.config.debug
        }

        console.groupCollapsed("Harmonisation");
        console.time("Time");

        for (this.time = { bar: 0, event: 0 }; !(this.time.bar === this.in.length && this.time.event === 0); this.step()) {
            if (this.time.bar < 0) {
                console.timeEnd("Time");
                console.info("Failed to harmonise");
                return this;
            }
        }

        console.timeEnd("Time");
        for (const part of ["s", "a", "t", "b", "chord"] as (Part | "chord")[]) {
            console.info(this.string(part));
        }
        console.groupEnd();
        return this;
    }

    private step() {
        const previousChord = this.inEvent.previous?.chord ?? new Chord(null, "", 0, new Numeral(0, 0, this.key.tonality));
        const chordOptions = previousChord.progression(this.config.dictionary).filter(chord => !this.inEvent.cadence || ["I", "i", "V"].includes(chord.string));
        for (; this.inEvent.map < chordOptions.length; ++this.inEvent.map) {
            const chord = chordOptions[this.inEvent.map];
            this.resolution = chord.resolve(this.key);

            // REJECT: PARTS DO NOT FIT
            if (this.partsUnfit()) {
                continue;
            }

            // REJECT: WRONG INVERSION
            if (this.inEvent.b && !this.inEvent.b?.tone.equals(this.resolution.at(this.resolution.inversion))) {
                continue;
            }

            // REJECT: Invalid second inversion chord
            if (previousChord.inversion === 2 && this.inEvent.previous?.previous?.chord?.stringFull === chord.stringFull) {
                if (this.config.debug) {
                    console.info(`Rejected '${chord.stringFull}': Invalid second inversion chord`);
                }
                continue;
            }

            // TEST VIABILITY
            this.outEvent.s = this.inEvent.s;
            this.outEvent.a = this.inEvent.a;
            this.outEvent.t = this.inEvent.t;
            this.outEvent.b = this.inEvent.b ?? (this.outEvent.previous?.b ?? Note.parse("Eb3")).near(this.resolution.at(this.resolution.inversion)).filter((note: Note) => note.pitch >= 28 && note.pitch <= 48 && note.pitch <= (this.outEvent.s as Note).pitch - 10)[0];
            this.outEvent.chord = chord;

            const quotas = this.resolution[3] !== null ? [1, 1, 1, 1] : [2, 1, 2, 0];

            for (const part of ["s", "a", "t", "b"] as Part[]) {
                const inversion = this.resolution.array.findIndex((tone: Tone) => tone.equals(this.outEvent[part]?.tone));
                --quotas[inversion];
            }

            if (this.resolution[3] === null) {
                if (quotas[0] === 0) quotas[2] = 1;
                if (quotas[2] === 0) quotas[0] = 1;
            }

            // REJECT: TOO MANY ROOTS
            if (quotas[0] < 0) {
                this.clear();
                if (this.config.debug) {
                    console.info(`Rejected '${chord.stringFull}': Too many roots`);
                }
                continue;
            }

            // REJECT: TOO MANY THIRDS
            if (quotas[1] < 0) {
                this.clear();
                if (this.config.debug) {
                    console.info(`Rejected '${chord.stringFull}': Too many thirds`);
                }
                continue;
            }

            // REJECT: TOO MANY FIFTHS
            if (quotas[2] < 0) {
                this.clear();
                if (this.config.debug) {
                    console.info(`Rejected '${chord.stringFull}': Too many fifths`);
                }
                continue;
            }

            // REJECT: TOO MANY SEVENTHS
            if (quotas[1] < 0) {
                this.clear();
                if (this.config.debug) {
                    console.info(`Rejected '${chord.stringFull}': Too many sevenths`);
                }
                continue;
            }

            // REJECT: S-B PARALLEL
            if (!(this.time.bar === 0 && this.time.event === 0) && this.parallel("s", "b")) {
                this.clear();
                if (this.config.debug) {
                    console.info(`Rejected '${chord.stringFull}': Soprano and bass in parallel`);
                }
                continue;
            }

            if (this.config.debug) {
                console.info(`Trying '${chord.stringFull}'`);
            }

            const ones = quotas.map((quota, inversion) => quota === 1 ? inversion : null).filter(inversion => inversion !== null) as Inversion[];
            const two = quotas.findIndex(quota => quota === 2) as Inversion | -1;

            const permutations = this.permute(ones, two);

            for (const permutation of permutations) {

                // REJECT: BAD REALISATION
                if (permutation.score === Infinity) {
                    continue;
                }

                this.outEvent.a = (this.outEvent.previous?.a ?? Note.parse("D4")).near(this.resolution.at(permutation.altoInversion))[0];
                this.outEvent.t = (this.outEvent.previous?.t ?? Note.parse("B3")).near(this.resolution.at(permutation.tenorInversion)).filter((note: Note) => note.pitch >= (this.outEvent.b as Note).pitch)[0];

                // REJECT: PARALLEL PARTS
                if (!(this.time.bar === 0 && this.time.event === 0) && (this.parallel("s", "a") || this.parallel("s", "t") || this.parallel("a", "t") || this.parallel("a", "b") || this.parallel("t", "b"))) {
                    if (this.config.debug) {
                        console.info(`|   Rejected permutation '${(this.outEvent.s as Note).string} ${(this.outEvent.a as Note).string} ${(this.outEvent.t as Note).string} ${(this.outEvent.b as Note).string}': Parallel parts`);
                    }
                    continue;
                }

                // ACCEPT
                this.inEvent.chord = chord;
                if (this.config.debug) {
                    console.info(`|   Accepted permutation '${this.outEvent.s?.string} ${this.outEvent.a?.string} ${this.outEvent.t?.string} ${this.outEvent.b?.string}'`);
                    console.info(`Accepted '${chord.stringFull}' (Bar ${this.time.bar + 1}, Chord ${this.time.event + 1})`);
                }
                if (++this.time.event === this.in[this.time.bar].length) {
                    this.time.event = 0;
                    ++this.time.bar;
                }
                return;
            }

            // REJECT: NO GOOD REALISATION
            this.clear();
            if (this.config.debug) {
                console.info(`Rejected '${chord.stringFull}': No good realisation`);
            }
            continue;
        }

        // REVERT: NO GOOD PROGRESSIONS
        this.inEvent.map = 0;
        if (--this.time.event < 0) {
            if (--this.time.bar >= 0) {
                this.time.event = this.in[this.time.bar].length - 1;
            }
        }
        if (this.time.bar >= 0) {
            ++this.inEvent.map;
        }
        if (this.config.debug) {
            console.info(`Reverted '${previousChord?.stringFull}': No good progressions available`);
        }
        return;
    }

    private partsUnfit() {
        if (this.resolution.excludes(this.inEvent.s?.tone)) {
            return true;
        }
        if (this.resolution.excludes(this.inEvent.a?.tone)) {
            return true;
        }
        if (this.resolution.excludes(this.inEvent.t?.tone)) {
            return true;
        }
        if (this.resolution.excludes(this.inEvent.b?.tone)) {
            return true;
        }
        return false;
    }

    private permute(ones: Inversion[], two: Inversion | -1) {
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
        const previousA = this.outEvent.previous?.a ?? Note.parse("D4");
        const previousT = this.outEvent.previous?.t ?? Note.parse("B3");
        const s = (this.outEvent.s as Note).pitch;
        const b = (this.outEvent.b as Note).pitch;
        const aNote = previousA.near(this.resolution.at(altoInversion))[0];
        const a = aNote.pitch
        const tNote = previousT.near(this.resolution.at(tenorInversion)).filter((note: Note) => note.pitch >= b)[0];
        const t = tNote.pitch;
        const aChange = Math.abs(a - previousA.pitch);
        const tChange = Math.abs(t - previousT.pitch);

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
        } else if (t < 40) {
            reason = "Tenor too low";
        } else if (t > 52) {
            reason = "Tenor too high";
        }

        if (reason !== "") {
            if (this.config.debug) {
                console.info(`|   Rejected permutation '${(this.outEvent.s as Note).string} ${aNote.string} ${tNote.string} ${(this.outEvent.b as Note).string}': ${reason}`);
            }
            return Infinity;
        }
        const sa = s - a;
        const at = a - t;
        const stdDev = Math.sqrt((sa * sa + at * at) / 2 - (sa + at) ** 2 / 4);
        const score = aChange + tChange + stdDev;
        if (this.config.debug) {
            console.info(`|   Permutation '${(this.outEvent.s as Note).string} ${aNote.string} ${tNote.string} ${(this.outEvent.b as Note).string}' scores ${score}`);
        }
        return score;
    }

    private parallel(upper: Part, lower: Part) {
        const previousEvent = this.outEvent.previous as Event;
        const event = this.outEvent as Event;
        const previousInterval = ((previousEvent[upper] as Note).pitch - (previousEvent[lower] as Note).pitch) % 12;
        const interval = ((event[upper] as Note).pitch - (event[lower] as Note).pitch) % 12;
        return (previousInterval === 0 && interval === 0 || previousInterval === 7 && interval === 7) && (previousEvent[upper] as Note).pitch !== (event[upper] as Note).pitch;
    }

    private clear() {
        this.outEvent.s = undefined;
        this.outEvent.a = undefined;
        this.outEvent.t = undefined;
        this.outEvent.b = undefined;
        this.outEvent.chord = undefined;
    }

    private string(part: Part | "chord") {
        return "[" + this.out.map(bar => bar.map(event => event[part]?.string.padEnd(6)).join(" ")).join("|") + "]";
    }
}
