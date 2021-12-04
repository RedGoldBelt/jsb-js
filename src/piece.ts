import Chord from "./chord.js";
import { FULL } from "./dictionary.js";
import Event from "./event.js";
import Group from "./group.js";
import Key from "./key.js";
import Numeral from "./numeral.js";
import Pitch from "./pitch.js";
import Resolution from "./resolution.js";
import Tone from "./tone.js";
import { Bar, Time, Config, Part, Inversion, Permutation } from "./util.js";

export default class Piece {
    private cache: Bar[] = [];
    private bars: Bar[] = [];
    private time: Time = { bar: 0, event: 0 };
    private key: Key;
    private resolution: Resolution = new Resolution(Tone.parse("C"), Tone.parse("C"), Tone.parse("C"), Tone.parse("C"), 0); // Dummy resolution
    private config: Config = {
        dictionary: FULL,
        debug: false
    }
    private success: boolean = false;

    constructor(key: string) {
        this.key = Key.parse(key);
    }

    load(bars: Bar[]) {
        this.cache = bars;
        return this;
    }

    parse(string: string, part: Part) {
        const split = string.split(/[[|\]]/).filter(bar => bar !== "").map(bar => bar.split(" ").filter(group => group !== ""));

        let previousCacheEvent: Event | undefined;
        let previousEvent: Event | undefined;

        for (let bar = 0; bar < split.length; ++bar) {
            this.cache[bar] ??= []
            this.bars[bar] = [];

            for (let event = 0; event < split[bar].length; ++event) {
                const cadence = split[bar][event].endsWith("@");
                if (cadence) {
                    split[bar][event] = split[bar][event].slice(0, -1);
                }
                const group = Group.parse(split[bar][event]);
                previousCacheEvent = this.cache[bar][event] ??= new Event(previousCacheEvent, group, new Group([], 0), new Group([], 0), new Group([], 0), cadence);
                this.cache[bar][event][part] = group;

                previousEvent = this.bars[bar][event] ??= new Event(previousEvent, group, new Group([], 0), new Group([], 0), new Group([], 0), cadence);
            }
        }
        return this;
    }

    private getCacheEvent() {
        return this.cache[this.time.bar][this.time.event];
    }

    private getEvent() {
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
                this.success = false;
                return this;
            }
        }

        console.timeEnd("Time");
        console.info(this.toString());
        console.groupEnd();
        this.success = true;
        return this;
    }

    private step() {
        if (this.getCacheEvent().getS().main() === undefined) {
            throw new Error("Soprano line not defined");
        }
        const previousChord = this.getEvent().previous?.getChord() ?? new Chord(null, "", 0, new Numeral(0, 0, this.key.tonality));
        const chordOptions = previousChord.progression(this.config.dictionary).filter(chord => !this.getEvent().isCadence() || ["I", "i", "V"].includes(chord.toStringStem()));
        for (; this.getEvent().map < chordOptions.length; ++this.getEvent().map) {
            const chord = chordOptions[this.getEvent().map];
            this.resolution = chord.resolve(this.key);

            // REJECT: PARTS DO NOT FIT
            if (this.partsUnfit()) {
                continue;
            }

            // REJECT: WRONG INVERSION
            if (this.getCacheEvent().getB().main() && !this.getCacheEvent().getB().main().pitch.tone.equals(this.resolution.at(this.resolution.inversion))) {
                continue;
            }

            // REJECT: Invalid second inversion chord
            if (previousChord.getInversion() === 2 && this.getEvent().previous?.previous?.getChord()?.toString() === chord.toString()) {
                if (this.config.debug) {
                    console.info(`Rejected '${chord.toString()}': Invalid second inversion chord`);
                }
                continue;
            }

            // TEST VIABILITY
            this.getEvent().setS(this.getCacheEvent().getS());
            this.getEvent().setA(this.getCacheEvent().getA());
            this.getEvent().setT(this.getCacheEvent().getT());
            if (this.getCacheEvent().getB().main()) {
                this.getEvent().setB(this.getCacheEvent().getB());
            } else {
                const options = (this.getEvent().previous?.getB().main().pitch ?? Pitch.parse("Eb3")).near(this.resolution.bass());
                this.getEvent().setB(options.filter((tone: Pitch) => tone.semitones() >= 28 && tone.semitones() <= 48 && tone.semitones() <= this.getEvent().getS().main().pitch.semitones() - 10)[0].toGroup(this.getEvent().getDuration()));
            }
            this.getEvent().setChord(chord);

            const quotas = this.resolution.seventh ? [1, 1, 1, 1] : [2, 1, 2, 0];

            for (const part of ["s", "a", "t", "b"] as Part[]) {
                const array = [this.resolution.root, this.resolution.third, this.resolution.fifth, this.resolution.seventh].filter(tone => tone !== undefined) as Tone[];
                const inversion = array.findIndex((tone: Tone) => tone.equals(this.getEvent()[part].main()?.pitch.tone));
                --quotas[inversion];
            }

            if (this.resolution.seventh === undefined) {
                if (quotas[0] === 0) quotas[2] = 1;
                if (quotas[2] === 0) quotas[0] = 1;
            }

            // REJECT: TOO MANY ROOTS
            if (quotas[0] < 0) {
                this.clear();
                if (this.config.debug) {
                    console.info(`Rejected '${chord.toString()}': Too many roots`);
                }
                continue;
            }

            // REJECT: TOO MANY THIRDS
            if (quotas[1] < 0) {
                this.clear();
                if (this.config.debug) {
                    console.info(`Rejected '${chord.toString()}': Too many thirds`);
                }
                continue;
            }

            // REJECT: TOO MANY FIFTHS
            if (quotas[2] < 0) {
                this.clear();
                if (this.config.debug) {
                    console.info(`Rejected '${chord.toString()}': Too many fifths`);
                }
                continue;
            }

            // REJECT: TOO MANY SEVENTHS
            if (quotas[1] < 0) {
                this.clear();
                if (this.config.debug) {
                    console.info(`Rejected '${chord.toString()}': Too many sevenths`);
                }
                continue;
            }

            // REJECT: S-B PARALLEL
            if (!(this.time.bar === 0 && this.time.event === 0) && this.parallel("s", "b")) {
                this.clear();
                if (this.config.debug) {
                    console.info(`Rejected '${chord.toString()}': Soprano and bass in parallel`);
                }
                continue;
            }

            if (this.config.debug) {
                console.info(`Trying '${chord.toString()}'`);
            }

            const ones = quotas.map((quota, inversion) => quota === 1 ? inversion : null).filter(inversion => inversion !== null) as Inversion[];
            const two = quotas.findIndex(quota => quota === 2) as Inversion | -1;

            const permutations = this.permute(ones, two);

            for (const permutation of permutations) {

                // REJECT: BAD REALISATION
                if (permutation.score === Infinity) {
                    continue;
                }

                this.getEvent().setA((this.getEvent().previous?.getA().main().pitch ?? Pitch.parse("D4")).near(this.resolution.at(permutation.altoInversion))[0].toGroup(this.getEvent().getDuration()));
                this.getEvent().setT((this.getEvent().previous?.getT().main().pitch ?? Pitch.parse("B3")).near(this.resolution.at(permutation.tenorInversion)).filter((tone: Pitch) => tone.semitones() >= this.getEvent().getB().main().pitch.semitones())[0].toGroup(this.getEvent().getDuration()));

                // REJECT: PARALLEL PARTS
                if (!(this.time.bar === 0 && this.time.event === 0) && (
                    this.parallel("s", "a") ||
                    this.parallel("s", "t") ||
                    this.parallel("a", "t") ||
                    this.parallel("a", "b") ||
                    this.parallel("t", "b"))) {
                    if (this.config.debug) {
                        console.info(`|   Rejected permutation '${this.getEvent().getS().toString()} ${this.getEvent().getA().toString()} ${this.getEvent().getT().toString()} ${this.getEvent().getB().toString()}': Parallel parts`);
                    }
                    continue;
                }

                // ACCEPT
                this.getEvent().setChord(chord);
                if (this.config.debug) {
                    console.info(`|   Accepted permutation '${this.getEvent().getS().toString()} ${this.getEvent().getA().toString()} ${this.getEvent().getT().toString()} ${this.getEvent().getB().toString()}'`);
                    console.info(`Accepted '${chord.toString()}' (Bar ${this.time.bar + 1}, Chord ${this.time.event + 1})`);
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
                console.info(`Rejected '${chord.toString()}': No good realisation`);
            }
            continue;
        }

        // REVERT: NO GOOD PROGRESSIONS
        this.getEvent().map = 0;
        if (--this.time.event < 0) {
            if (--this.time.bar >= 0) {
                this.time.event = this.cache[this.time.bar].length - 1;
            }
        }
        if (this.time.bar >= 0) {
            ++this.getEvent().map;
        }
        if (this.config.debug) {
            console.info(`Reverted '${previousChord?.toString()}': No good progressions available`);
        }
        return;
    }

    private partsUnfit() {
        if (this.resolution.excludes(this.getCacheEvent().getS().main().pitch.tone)) {
            return true;
        }
        if (this.resolution.excludes(this.getCacheEvent().getA().main()?.pitch.tone)) {
            return true;
        }
        if (this.resolution.excludes(this.getCacheEvent().getT().main()?.pitch.tone)) {
            return true;
        }
        if (this.resolution.excludes(this.getCacheEvent().getB().main()?.pitch.tone)) {
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
        const previousA = this.getEvent().previous?.getA().at(-1).pitch ?? Pitch.parse("D4");
        const previousT = this.getEvent().previous?.getT().at(-1).pitch ?? Pitch.parse("B3");
        const s = this.getEvent().getS().main().pitch.semitones();
        const b = this.getEvent().getB().main().pitch.semitones();
        const aTone = previousA.near(this.resolution.at(altoInversion))[0];
        const a = aTone.semitones();
        const tTone = previousT.near(this.resolution.at(tenorInversion))[0];
        const t = tTone.semitones();
        const aChange = Math.abs(a - previousA.semitones());
        const tChange = Math.abs(t - previousT.semitones());

        if (
            aChange > 7 ||
            tChange > 7 ||
            a > s ||
            t > a ||
            b > t ||
            a > 64 ||
            a < 43 ||
            t < 40 ||
            t > 52
        ) {
            if (this.config.debug) {
                console.info(`|   '${this.getEvent().getS().main().toString()} ${aTone.toString()} ${tTone.toString()} ${this.getEvent().getB().main().toString()}' rejected`);
            }
            return Infinity;
        }
        const sa = s - a;
        const at = a - t;
        const stdDev = Math.sqrt((sa * sa + at * at) / 2 - (sa + at) ** 2 / 4);
        const score = aChange + tChange + stdDev;
        if (this.config.debug) {
            console.info(`|   '${this.getEvent().getS().main().toString()} ${aTone.toString()} ${tTone.toString()} ${this.getEvent().getB().main().toString()}' scores ${score}`);
        }
        return score;
    }

    private parallel(upper: Part, lower: Part) {
        const previousEvent = this.getEvent().previous as Event;
        const previousInterval = (previousEvent[upper].at(-1).pitch.semitones() - previousEvent[lower].at(-1).pitch.semitones()) % 12;
        const interval = (this.getEvent()[upper].at(0).pitch.semitones() - this.getEvent()[lower].at(0).pitch.semitones()) % 12;
        return (previousInterval === 0 && interval === 0 || previousInterval === 7 && interval === 7) && previousEvent[upper].at(-1).pitch !== this.getEvent()[upper].at(0).pitch;
    }

    private clear() {
        this.getEvent().setS(new Group([], 0));
        this.getEvent().setA(new Group([], 0));
        this.getEvent().setT(new Group([], 0));
        this.getEvent().setB(new Group([], 0));
        this.getEvent().setChord(undefined);
    }

    private toString() {
        return `[${this.bars.map(bar => bar.map(event => event.getS().toString().padEnd(8)).join(" ")).join("|")}]
[${this.bars.map(bar => bar.map(event => event.getA().toString().padEnd(8)).join(" ")).join("|")}]
[${this.bars.map(bar => bar.map(event => event.getT().toString().padEnd(8)).join(" ")).join("|")}]
[${this.bars.map(bar => bar.map(event => event.getB().toString().padEnd(8)).join(" ")).join("|")}]
[${this.bars.map(bar => bar.map(event => event.getChord()?.toString().padEnd(8)).join(" ")).join("|")}]`
    }
}
