import Chord from "./chord.js";
import * as DICTIONARY from "./dictionary.js";
import Key from "./key.js";
import Tone from "./tone.js";
import Numeral from "./numeral.js";
import Resolution from "./resolution.js";
import Event from "./event.js";
import BasicTone from "./basictone.js";
import { Bar, Config, Inversion, Part, Permutation, Time } from "./util.js";
import Group from "./group.js";

export default class Piece {
    cache: Bar[];
    bars: Bar[] = [];

    private time: Time = { bar: 0, event: 0 };
    private key: Key;
    private resolution: Resolution = new Resolution(BasicTone.parse("C"), BasicTone.parse("C"), BasicTone.parse("C"), BasicTone.parse("C"), 0); // Dummy resolution
    private config: Config = {
        dictionary: DICTIONARY.FULL,
        debug: false
    }

    constructor(key: string, soprano: string) {
        this.key = Key.parse(key);
        this.cache = [];
        this.load(soprano, "soprano");
        return this;
    }

    private load(string: string, part: "soprano" | "alto" | "tenor" | "bass") {
        const split = string.split(/[[|\]]/).filter(bar => bar !== "").map(bar => bar.split(" ").filter(group => group !== ""));

        let previousCacheEvent: Event | undefined;
        let previousEvent: Event | undefined;

        for (let bar = 0; bar < split.length; ++bar) {
            this.cache[bar] ??= []
            this.bars[bar] = [];

            for (let event = 0; event < split[bar].length; ++event) {
                const group = Group.parse(split[bar][event]);
                previousCacheEvent = this.cache[bar][event] ??= new Event(previousCacheEvent, group, new Group([], 0), new Group([], 0), new Group([], 0));
                this.cache[bar][event][part] = group;

                previousEvent = this.bars[bar][event] ??= new Event(previousEvent, group, new Group([], 0), new Group([], 0), new Group([], 0));
            }
        }
        return this;
    }

    private get cacheEvent() {
        return this.cache[this.time.bar][this.time.event];
    }

    private get event() {
        return this.bars[this.time.bar][this.time.event];
    }

    harmonise(config: Config = {}) {
        this.config = {
            dictionary: config.dictionary ?? this.config.dictionary,
            debug: config.debug ?? this.config.debug
        }

        console.groupCollapsed("Harmonisation");
        console.time("Time");

        for (this.time = { bar: 0, event: 0 }; !(this.time.bar === this.cache.length && this.time.event === 0); this.step()) {
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
        const previousChord = this.event.previous?.chord ?? new Chord(null, "", 0, new Numeral(0, 0, this.key.tonality));
        const chordOptions = previousChord.progression(this.config.dictionary).filter(chord => !this.event.cadence || ["I", "i", "V"].includes(chord.string));
        for (; this.event.map < chordOptions.length; ++this.event.map) {
            const chord = chordOptions[this.event.map];
            this.resolution = chord.resolve(this.key);

            // REJECT: PARTS DO NOT FIT
            if (this.partsUnfit()) {
                continue;
            }

            // REJECT: WRONG INVERSION
            if (this.cacheEvent.b && !this.cacheEvent.b?.equals(this.resolution.at(this.resolution.inversion))) {
                continue;
            }

            // REJECT: Invalid second inversion chord
            if (previousChord.inversion === 2 && this.event.previous?.previous?.chord?.stringFull === chord.stringFull) {
                if (this.config.debug) {
                    console.info(`Rejected '${chord.stringFull}': Invalid second inversion chord`);
                }
                continue;
            }

            // TEST VIABILITY
            this.event.soprano = this.cacheEvent.soprano;
            this.event.alto = this.cacheEvent.alto;
            this.event.tenor = this.cacheEvent.tenor;
            if (this.cacheEvent.b) {
                this.event.bass = this.cacheEvent.bass;
            } else {
                this.event.b = (this.event.previous?.b ?? Tone.parse("Eb3")).near(this.resolution.at(this.resolution.inversion)).filter((tone: Tone) => tone.pitch >= 28 && tone.pitch <= 48 && tone.pitch <= (this.event.s as Tone).pitch - 10)[0];
            }
            this.event.chord = chord;

            const quotas = this.resolution[3] !== null ? [1, 1, 1, 1] : [2, 1, 2, 0];

            for (const part of ["s", "a", "t", "b"] as Part[]) {
                const inversion = this.resolution.array.findIndex((tone: BasicTone) => tone.equals(this.event[part]));
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

                this.event.a = (this.event.previous?.a ?? Tone.parse("D4")).near(this.resolution.at(permutation.altoInversion))[0];
                this.event.t = (this.event.previous?.t ?? Tone.parse("B3")).near(this.resolution.at(permutation.tenorInversion)).filter((tone: Tone) => tone.pitch >= this.event.b.pitch)[0];

                // REJECT: PARALLEL PARTS
                if (!(this.time.bar === 0 && this.time.event === 0) && (
                    this.parallel("s", "a") ||
                    this.parallel("s", "t") ||
                    this.parallel("a", "t") ||
                    this.parallel("a", "b") ||
                    this.parallel("t", "b"))) {
                    if (this.config.debug) {
                        console.info(`|   Rejected permutation '${this.event.s.string} ${this.event.a.string} ${this.event.t.string} ${this.event.b.string}': Parallel parts`);
                    }
                    continue;
                }

                // ACCEPT
                this.event.chord = chord;
                if (this.config.debug) {
                    console.info(`|   Accepted permutation '${this.event.s.string} ${this.event.a.string} ${this.event.t.string} ${this.event.b.string}'`);
                    console.info(`Accepted '${chord.stringFull}' (Bar ${this.time.bar + 1}, Chord ${this.time.event + 1})`);
                }
                if (++this.time.event === this.cache[this.time.bar].length) {
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
        this.event.map = 0;
        if (--this.time.event < 0) {
            if (--this.time.bar >= 0) {
                this.time.event = this.cache[this.time.bar].length - 1;
            }
        }
        if (this.time.bar >= 0) {
            ++this.event.map;
        }
        if (this.config.debug) {
            console.info(`Reverted '${previousChord?.stringFull}': No good progressions available`);
        }
        return;
    }

    private partsUnfit() {
        if (this.resolution.excludes(this.cacheEvent.s)) {
            return true;
        }
        if (this.resolution.excludes(this.cacheEvent.a)) {
            return true;
        }
        if (this.resolution.excludes(this.cacheEvent.t)) {
            return true;
        }
        if (this.resolution.excludes(this.cacheEvent.b)) {
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
        const previousA = this.event.previous?.a ?? Tone.parse("D4");
        const previousT = this.event.previous?.t ?? Tone.parse("B3");
        const s = this.event.s.pitch;
        const b = this.event.b.pitch;
        const aTone = previousA.near(this.resolution.at(altoInversion))[0];
        const a = aTone.pitch;
        const tTone = previousT.near(this.resolution.at(tenorInversion))[0];
        const t = tTone.pitch;
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
                console.info(`|   Rejected permutation '${this.event.s.string} ${aTone.string} ${tTone.string} ${this.event.b.string}': ${reason}`);
            }
            return Infinity;
        }
        const sa = s - a;
        const at = a - t;
        const stdDev = Math.sqrt((sa * sa + at * at) / 2 - (sa + at) ** 2 / 4);
        const score = aChange + tChange + stdDev;
        if (this.config.debug) {
            console.info(`|   Permutation '${this.event.s.string} ${aTone.string} ${tTone.string} ${this.event.b.string}' scores ${score}`);
        }
        return score;
    }

    private parallel(upper: Part, lower: Part) {
        const previousEvent = this.event.previous as Event;
        const previousInterval = (previousEvent[upper].pitch - previousEvent[lower].pitch) % 12;
        const interval = (this.event[upper].pitch - this.event[lower].pitch) % 12;
        return (previousInterval === 0 && interval === 0 || previousInterval === 7 && interval === 7) && previousEvent[upper].pitch !== this.event[upper].pitch;
    }

    private clear() {
        this.event.soprano = new Group([], 0);
        this.event.alto = new Group([], 0);
        this.event.tenor = new Group([], 0);
        this.event.bass = new Group([], 0);
        this.event.chord = undefined;
    }

    private string(part: Part | "chord") {
        return "[" + this.bars.map(bar => bar.map(event => event[part]?.string.padEnd(6)).join(" ")).join("|") + "]";
    }
}
