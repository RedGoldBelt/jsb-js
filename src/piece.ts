import Chord from "./chord.js";
import { FULL } from "./dictionary.js";
import Event from "./event.js";
import Group from "./group.js";
import Key from "./key.js";
import Numeral from "./numeral.js";
import Pitch from "./pitch.js";
import Resolution from "./resolution.js";
import Tone from "./tone.js";
import { Bar, Time, Config, Part, Inversion, Permutation, Printable } from "./util.js";

export default class Piece implements Printable {
    private input: Bar[] = [];
    private output: Bar[] = [];
    private time: Time = { bar: 0, event: 0 };
    private key: Key = Key.parse("C major");
    private config: Config = { dictionary: FULL, debug: false }
    private status: boolean = false;

    constructor(config: Config = {}) {
        this.setConfig(config);
    }

    parse(string: string, part: Part) {
        const split = string.split(/[[|\]]/).filter(bar => bar !== "").map(bar => bar.split(" ").filter(group => group !== ""));

        for (let bar = 0; bar < split.length; ++bar) {
            this.getInput()[bar] ??= []

            for (let event = 0; event < split[bar].length; ++event) {
                const cadence = split[bar][event].endsWith("@");
                if (cadence) {
                    split[bar][event] = split[bar][event].slice(0, -1);
                }
                this.getInput()[bar][event] ??= new Event(Group.empty(), Group.empty(), Group.empty(), Group.empty(), cadence);
                this.getInput()[bar][event][part] = Group.parse(split[bar][event]);
            }
        }
        return this;
    }

    private inputEvent() {
        return this.getInput()[this.getTime().bar][this.getTime().event];
    }

    private previousPreviousOutputEvent() {
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

    private previousOutputEvent() {
        let { bar, event } = this.time;
        if (--event < 0) {
            if (--bar < 0) {
                return undefined;
            }
            event = this.getOutput()[bar].length - 1;
        }
        return this.getOutput()[bar][event];
    }

    private outputEvent() {
        return this.getOutput()[this.getTime().bar][this.getTime().event];
    }

    harmonise() {
        this.setOutput([]);

        for (this.setTime({ bar: 0, event: 0 }); this.getTime().bar !== this.getInput().length; this.step()) {
            if (this.getTime().bar < 0) {
                this.setStatus(false);
                return this;
            }
            if (this.inputEvent().getS().main() === undefined) {
                this.setStatus(false);
                return this;
            }
        }
        this.setStatus(true);
        return this;
    }

    private step() {
        this.getOutput()[this.time.bar] ??= [];
        this.getOutput()[this.time.bar][this.time.event] ??= new Event(Group.empty(), Group.empty(), Group.empty(), Group.empty(), this.inputEvent().isCadence());
        const previousChord = this.previousOutputEvent()?.getChord() ?? new Chord(null, "", 0, new Numeral(0, 0, this.key.getTonality()));
        const chordOptions = previousChord.progression(this.config.dictionary).filter(chord => !this.outputEvent().isCadence() || ["I", "i", "V"].includes(chord.toStringStem()));
        for (; this.outputEvent().map < chordOptions.length; ++this.outputEvent().map) {
            const chord = chordOptions[this.outputEvent().map];
            const resolution = chord.resolve(this.key);

            // REJECT: PARTS DO NOT FIT
            if (
                resolution.excludes(this.inputEvent().getS().main().getPitch().getTone()) ||
                resolution.excludes(this.inputEvent().getA().main()?.getPitch().getTone()) ||
                resolution.excludes(this.inputEvent().getT().main()?.getPitch().getTone()) ||
                resolution.excludes(this.inputEvent().getB().main()?.getPitch().getTone())
            ) {
                continue;
            }

            // REJECT: WRONG INVERSION
            if (this.inputEvent().getB().main() && !this.inputEvent().getB().main().getPitch().getTone().equals(resolution.bass())) {
                continue;
            }

            // REJECT: Invalid second inversion chord
            if (previousChord.getInversion() === 2 && this.previousPreviousOutputEvent()?.getChord()?.string() === chord.string()) {
                if (this.config.debug) {
                    console.info(`Rejected '${chord.string()}': Invalid second inversion chord`);
                }
                continue;
            }

            // TEST VIABILITY
            this.outputEvent().setS(this.inputEvent().getS());
            this.outputEvent().setA(this.inputEvent().getA());
            this.outputEvent().setT(this.inputEvent().getT());
            if (this.inputEvent().getB().main()) {
                this.outputEvent().setB(this.inputEvent().getB());
            } else {
                const options = (this.previousOutputEvent()?.getB().main().getPitch() ?? Pitch.parse("Eb3")).near(resolution.bass());
                const pitch = options.filter((tone: Pitch) => tone.semitones() >= 28 && tone.semitones() <= 48 && tone.semitones() <= this.outputEvent().getS().main().getPitch().semitones() - 10)[0];
                this.outputEvent().setB(pitch.group(this.outputEvent().duration()));
            }
            this.outputEvent().setChord(chord);

            const quotas = resolution.getSeventh() ? [1, 1, 1, 1] : [2, 1, 2, 0];

            for (const part of ["s", "a", "t", "b"] as Part[]) {
                const array = [resolution.getRoot(), resolution.getThird(), resolution.getFifth(), resolution.getSeventh()].filter(tone => tone !== undefined) as Tone[];
                const inversion = array.findIndex((tone: Tone) => tone.equals(this.outputEvent().getPart(part).main()?.getPitch().getTone()));
                --quotas[inversion];
            }

            if (resolution.getSeventh() === undefined) {
                if (quotas[0] === 0) quotas[2] = 1;
                if (quotas[2] === 0) quotas[0] = 1;
            }

            // REJECT: TOO MANY ROOTS
            if (quotas[0] < 0) {
                if (this.config.debug) {
                    console.info(`Rejected '${chord.string()}': Too many roots`);
                }
                continue;
            }

            // REJECT: TOO MANY THIRDS
            if (quotas[1] < 0) {
                if (this.config.debug) {
                    console.info(`Rejected '${chord.string()}': Too many thirds`);
                }
                continue;
            }

            // REJECT: TOO MANY FIFTHS
            if (quotas[2] < 0) {
                if (this.config.debug) {
                    console.info(`Rejected '${chord.string()}': Too many fifths`);
                }
                continue;
            }

            // REJECT: TOO MANY SEVENTHS
            if (quotas[1] < 0) {
                if (this.config.debug) {
                    console.info(`Rejected '${chord.string()}': Too many sevenths`);
                }
                continue;
            }

            // REJECT: S-B PARALLEL
            if (this.checkParallel("s", "b")) {
                if (this.config.debug) {
                    console.info(`Rejected '${chord.string()}': Soprano and bass in parallel`);
                }
                continue;
            }

            if (this.config.debug) {
                console.info(`Trying '${chord.string()}'`);
            }

            const ones = quotas.map((quota, inversion) => quota === 1 ? inversion : null).filter(inversion => inversion !== null) as Inversion[];
            let two = quotas.findIndex(quota => quota === 2) as Inversion | -1;

            let permutations: Permutation[];

            switch (ones.length as 1 | 2 | 3) {
                case 1:
                    two = two as Inversion;
                    const permutation1: Permutation = {
                        altoInversion: ones[0],
                        tenorInversion: two,
                        score: this.score(ones[0], two, resolution)
                    };
                    const permutation2: Permutation = {
                        altoInversion: two,
                        tenorInversion: ones[0],
                        score: this.score(two, ones[0], resolution)
                    };
                    const permutation3: Permutation = {
                        altoInversion: two,
                        tenorInversion: two,
                        score: this.score(two, two, resolution)
                    };
                    permutations = [permutation1, permutation2, permutation3].sort((l, r) => l.score - r.score);
                    break;
                case 2:
                    const permutation4: Permutation = {
                        altoInversion: ones[0],
                        tenorInversion: ones[1],
                        score: this.score(ones[0], ones[1], resolution)
                    };
                    const permutation5: Permutation = {
                        altoInversion: ones[1],
                        tenorInversion: ones[0],
                        score: this.score(ones[1], ones[0], resolution)
                    };
                    permutations = [permutation4, permutation5].sort((l, r) => l.score - r.score);
                    break;
                case 3:
                    const permutation6: Permutation = {
                        altoInversion: ones[0],
                        tenorInversion: ones[1],
                        score: this.score(ones[0], ones[1], resolution)
                    };
                    const permutation7: Permutation = {
                        altoInversion: ones[1],
                        tenorInversion: ones[0],
                        score: this.score(ones[1], ones[0], resolution)
                    };
                    const permutation8: Permutation = {
                        altoInversion: ones[1],
                        tenorInversion: ones[2],
                        score: this.score(ones[1], ones[2], resolution)
                    };
                    const permutation9: Permutation = {
                        altoInversion: ones[2],
                        tenorInversion: ones[1],
                        score: this.score(ones[2], ones[1], resolution)
                    };
                    permutations = [permutation6, permutation7, permutation8, permutation9].sort((l, r) => l.score - r.score);
                    break;
            }

            for (const permutation of permutations) {

                // REJECT: BAD REALISATION
                if (permutation.score === Infinity) {
                    continue;
                }

                this.outputEvent().setA((this.previousOutputEvent()?.getA().main().getPitch() ?? Pitch.parse("D4")).near(resolution.at(permutation.altoInversion))[0].group(this.outputEvent().duration()));
                this.outputEvent().setT((this.previousOutputEvent()?.getT().main().getPitch() ?? Pitch.parse("B3")).near(resolution.at(permutation.tenorInversion)).filter((tone: Pitch) => tone.semitones() >= this.outputEvent().getB().main().getPitch().semitones())[0].group(this.outputEvent().duration()));

                // REJECT: PARALLEL PARTS
                if (
                    this.checkParallel("s", "a") ||
                    this.checkParallel("s", "t") ||
                    this.checkParallel("a", "t") ||
                    this.checkParallel("a", "b") ||
                    this.checkParallel("t", "b")) {
                    if (this.config.debug) {
                        console.info(`|   Rejected permutation '${this.outputEvent().getS().string()} ${this.outputEvent().getA().string()} ${this.outputEvent().getT().string()} ${this.outputEvent().getB().string()}': Parallel parts`);
                    }
                    continue;
                }

                // ACCEPT
                this.outputEvent().setChord(chord);
                if (this.config.debug) {
                    console.info(`|   Accepted permutation '${this.outputEvent().getS().string()} ${this.outputEvent().getA().string()} ${this.outputEvent().getT().string()} ${this.outputEvent().getB().string()}'`);
                    console.info(`Accepted '${chord.string()}' (Bar ${this.getTime().bar + 1}, Chord ${this.getTime().event + 1})`);
                }
                if (++this.getTime().event === this.getInput()[this.getTime().bar].length) {
                    this.getTime().event = 0;
                    ++this.getTime().bar;
                }
                return;
            }

            // REJECT: NO GOOD REALISATION
            if (this.config.debug) {
                console.info(`Rejected '${chord.string()}': No good realisation`);
            }
            continue;
        }

        // REVERT: NO GOOD PROGRESSIONS
        this.outputEvent().map = 0;
        if (--this.getTime().event < 0) {
            if (--this.getTime().bar >= 0) {
                this.getTime().event = this.getInput()[this.getTime().bar].length - 1;
            }
        }
        if (this.getTime().bar >= 0) {
            ++this.outputEvent().map;
        }
        if (this.config.debug) {
            console.info(`Reverted '${previousChord?.string()}': No good progressions available`);
        }
        return;
    }

    private score(altoInversion: Inversion, tenorInversion: Inversion, resolution: Resolution) {
        const previousA = this.previousOutputEvent()?.getA().at(-1).getPitch() ?? Pitch.parse("D4");
        const previousT = this.previousOutputEvent()?.getT().at(-1).getPitch() ?? Pitch.parse("B3");
        const s = this.outputEvent().getS().main().getPitch().semitones();
        const b = this.outputEvent().getB().main().getPitch().semitones();
        const aTone = previousA.near(resolution.at(altoInversion))[0];
        const a = aTone.semitones();
        const tTone = previousT.near(resolution.at(tenorInversion))[0];
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
                console.info(`|   '${this.outputEvent().getS().main().string()} ${aTone.string()} ${tTone.string()} ${this.outputEvent().getB().main().string()}' rejected`);
            }
            return Infinity;
        }
        const sa = s - a;
        const at = a - t;
        const stdDev = Math.sqrt((sa * sa + at * at) / 2 - (sa + at) ** 2 / 4);
        const score = aChange + tChange + stdDev;
        if (this.config.debug) {
            console.info(`|   '${this.outputEvent().getS().main().string()} ${aTone.string()} ${tTone.string()} ${this.outputEvent().getB().main().string()}' scores ${score}`);
        }
        return score;
    }

    private checkParallel(upper: Part, lower: Part) {
        const previousEvent = this.previousOutputEvent();
        if (previousEvent === undefined) {
            return false;
        }
        const previousUpper = previousEvent.getPart(upper).at(-1).getPitch().semitones();
        const previousLower = previousEvent.getPart(lower).at(-1).getPitch().semitones()
        const currentUpper = this.outputEvent().getPart(upper).at(0).getPitch().semitones();
        const currentLower = this.outputEvent().getPart(lower).at(0).getPitch().semitones();
        const previousInterval = (previousUpper - previousLower) % 12;
        const interval = (currentUpper - currentLower) % 12;
        return (previousInterval === 0 && interval === 0 || previousInterval === 7 && interval === 7) && previousUpper !== currentUpper && previousLower !== currentLower;
    }

    getInput() {
        return this.input;
    }

    setInput(input: Bar[]) {
        this.input = input;
        return this;
    }

    getOutput() {
        return this.output;
    }

    setOutput(output: Bar[]) {
        this.output = output;
        return this;
    }

    getTime() {
        return this.time;
    }

    setTime(time: Time) {
        this.time = time;
        return this;
    }

    getKey() {
        return this.key;
    }

    setKey(string: string) {
        this.key = Key.parse(string);
        return this;
    }

    getConfig() {
        return this.config;
    }

    setConfig(config: Config) {
        this.config = {
            dictionary: config.dictionary ?? this.config.dictionary,
            debug: config.debug ?? this.config.debug
        }
        return this;
    }

    getStatus() {
        return this.status;
    }

    setStatus(status: boolean) {
        this.status = status;
        return this;
    }

    string() {
        return `[${this.getOutput().map(bar => bar.map(event => event.getS().string().padEnd(8)).join(" ")).join("|")}]
[${this.getOutput().map(bar => bar.map(event => event.getA().string().padEnd(8)).join(" ")).join("|")}]
[${this.getOutput().map(bar => bar.map(event => event.getT().string().padEnd(8)).join(" ")).join("|")}]
[${this.getOutput().map(bar => bar.map(event => event.getB().string().padEnd(8)).join(" ")).join("|")}]
[${this.getOutput().map(bar => bar.map(event => event.getChord()?.string().padEnd(8)).join(" ")).join("|")}]`
    }
}
