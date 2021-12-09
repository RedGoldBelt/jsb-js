import Chord from "./chord.js";
import Dict from "./dictionary.js";
import Event from "./event.js";
import Group from "./group.js";
import Key from "./key.js";
import Numeral from "./numeral.js";
import Pitch from "./pitch.js";
import Tone from "./tone.js";
import Util from "./util.js";

export default class Piece implements Util.Printable {
    private input: Util.Bar[] = [];
    private output: Util.Bar[] = [];
    private time: Util.Time = { bar: 0, event: 0 };
    private maxTime: Util.Time = { bar: 0, event: 0 };
    private key = Key.parse("C major");
    private dictionary = Dict.FULL;

    parse(string: string, part: Util.Part) {
        const split = string.split(/[[|\]]/).filter(bar => bar !== "").map(bar => bar.split(" ").filter(group => group !== ""));

        for (let bar = 0; bar < split.length; ++bar) {
            this.getInput()[bar] ??= [];

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
        this.setMaxTime({ bar: 0, event: 0 });
        for (this.setTime({ bar: 0, event: 0 }); this.getTime().bar !== this.getInput().length; this.step()) {
            if (this.getTime().bar < 0) {
                throw "Failed to harmonise.";
            }
            if (this.getTime().bar > this.getMaxTime().bar) {
                this.setMaxTime({ ...this.getTime() });
            } else if (this.getTime().bar === this.getMaxTime().bar) {
                if (this.getTime().event >= this.getMaxTime().event) {
                    this.getMaxTime().event = this.getTime().event;
                }
            }
        }
        return this;
    }

    private step() {
        const inputEvent = this.getInput()[this.getTime().bar][this.getTime().event];
        this.getOutput()[this.time.bar] ??= [];
        this.getOutput()[this.time.bar][this.time.event] ??= new Event(Group.empty(), Group.empty(), Group.empty(), Group.empty(), inputEvent.isCadence());
        const previousChord = this.previousOutputEvent()?.getChord() ?? new Chord(null, "", 0, new Numeral(0, 0, this.key.getTonality()));
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

            if ((["s", "a", "t", "b"] as Util.Part[]).filter(part => defined[part]).map(part => inputEvent.getPart(part).duration()).some((duration, i, array) => duration !== array[0])) {
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
                a: this.previousOutputEvent()?.getA().at(-1).getPitch() ?? Pitch.parse("D4"),
                t: this.previousOutputEvent()?.getT().at(-1).getPitch() ?? Pitch.parse("B3"),
                b: this.previousOutputEvent()?.getB().at(-1).getPitch() ?? Pitch.parse("Eb3")
            }

            if (!defined.b) {
                const options = resolution.bass().near(target.b);
                const pitch = options.filter(tone => tone.semitones() >= 28 && tone.semitones() <= 48 && tone.semitones() <= this.outputEvent().getS().main().getPitch().semitones() - 10)[0];
                this.outputEvent().setB(pitch.group(this.outputEvent().duration()));
            }

            if (
                resolution.excludes(inputEvent.getS().main()?.getPitch().getTone()) ||
                resolution.excludes(inputEvent.getA().main()?.getPitch().getTone()) ||
                resolution.excludes(inputEvent.getT().main()?.getPitch().getTone()) ||
                resolution.excludes(inputEvent.getB().main()?.getPitch().getTone())
            ) {
                continue;
            }

            if (inputEvent.getB().main() && !inputEvent.getB().main().getPitch().getTone().equals(resolution.bass())) {
                continue;
            }

            if (previousChord.getInversion() === 2 && this.previousPreviousOutputEvent()?.getChord()?.string() === chord.string()) {
                continue;
            }

            const quotas = resolution.getSeventh() ? [1, 1, 1, 1] : [2, 1, 2, 0];

            for (const part of ["s", "a", "t", "b"] as Util.Part[]) {
                const array = [resolution.getRoot(), resolution.getThird(), resolution.getFifth(), resolution.getSeventh()].filter(tone => tone !== undefined) as Tone[];
                const inversion = array.findIndex((tone: Tone) => tone.equals(this.outputEvent().getPart(part).main()?.getPitch().getTone()));
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

            let permutations: Util.Permutation[];
            const ones = quotas.map((quota, inversion) => quota === 1 ? resolution.at(inversion as Util.Inversion) : undefined).filter(tone => tone !== undefined) as Tone[];

            let a: Pitch;
            let t: Pitch;

            if (!defined.a && !defined.t) {
                let two = resolution.at(quotas.findIndex(quota => quota === 2) as Util.Inversion);

                switch (ones.length as 1 | 2 | 3) {
                    case 1:
                        const permutation1: Util.Permutation = {
                            a: a = ones[0].near(target.a)[0],
                            t: t = two.near(target.t)[0],
                            score: this.score(a, t)
                        };
                        const permutation2: Util.Permutation = {
                            a: a = two.near(target.a)[0],
                            t: t = ones[0].near(target.t)[0],
                            score: this.score(a, t)
                        };
                        const permutation3: Util.Permutation = {
                            a: a = two.near(target.a)[0],
                            t: t = two.near(target.t)[0],
                            score: this.score(a, t)
                        };
                        permutations = [permutation1, permutation2, permutation3].sort((l, r) => l.score - r.score);
                        break;
                    case 2:
                        const permutation4: Util.Permutation = {
                            a: a = ones[0].near(target.a)[0],
                            t: t = ones[1].near(target.t)[0],
                            score: this.score(a, t)
                        };
                        const permutation5: Util.Permutation = {
                            a: a = ones[1].near(target.a)[0],
                            t: t = ones[0].near(target.t)[0],
                            score: this.score(a, t)
                        };
                        permutations = [permutation4, permutation5].sort((l, r) => l.score - r.score);
                        break;
                    case 3:
                        const permutation6: Util.Permutation = {
                            a: a = ones[0].near(target.a)[0],
                            t: t = ones[1].near(target.t)[0],
                            score: this.score(a, t)
                        };
                        const permutation7: Util.Permutation = {
                            a: a = ones[1].near(target.a)[0],
                            t: t = ones[0].near(target.t)[0],
                            score: this.score(a, t)
                        };
                        const permutation8: Util.Permutation = {
                            a: a = ones[1].near(target.a)[0],
                            t: t = ones[2].near(target.t)[0],
                            score: this.score(a, t)
                        };
                        const permutation9: Util.Permutation = {
                            a: a = ones[2].near(target.a)[0],
                            t: t = ones[1].near(target.t)[0],
                            score: this.score(a, t)
                        };
                        permutations = [permutation6, permutation7, permutation8, permutation9].sort((l, r) => l.score - r.score);
                        break;
                }
            } else if (defined.a && !defined.t) {
                a = this.outputEvent().getA().main().getPitch();
                if (ones.length === 1) {
                    permutations = [{
                        a: a,
                        t: t = ones[0].near(target.t)[0],
                        score: this.score(a, t)
                    }];
                } else {
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
            } else if (!defined.a && defined.t) {
                t = this.outputEvent().getT().main().getPitch();
                if (ones.length === 1) {
                    permutations = [{
                        a: a = ones[0].near(target.a)[0],
                        t: t,
                        score: this.score(a, t)
                    }];
                } else {
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
            } else {
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

                if (
                    this.checkParallel("s", "a") ||
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

    private score(aPitch: Pitch, tPitch: Pitch) {
        const s = this.outputEvent().getS().main().getPitch().semitones();
        const a = aPitch.semitones();
        const t = tPitch.semitones();
        const b = this.outputEvent().getB().main().getPitch().semitones();
        const previousA = this.previousOutputEvent()?.getA().at(-1).getPitch() ?? Pitch.parse("D4");
        const previousT = this.previousOutputEvent()?.getT().at(-1).getPitch() ?? Pitch.parse("B3");
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
            return Infinity;
        }
        const sa = s - a;
        const at = a - t;
        const stdDev = Math.sqrt((sa * sa + at * at) / 2 - (sa + at) ** 2 / 4);
        const score = aChange + tChange + stdDev;
        return score;
    }

    private checkParallel(upper: Util.Part, lower: Util.Part) {
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

    setInput(input: Util.Bar[]) {
        this.input = input;
        return this;
    }

    getOutput() {
        return this.output;
    }

    setOutput(output: Util.Bar[]) {
        this.output = output;
        return this;
    }

    getTime() {
        return this.time;
    }

    setTime(time: Util.Time) {
        this.time = time;
        return this;
    }

    getMaxTime() {
        return this.maxTime;
    }

    setMaxTime(maxTime: Util.Time) {
        this.maxTime = maxTime;
        return this;
    }

    getKey() {
        return this.key;
    }

    setKey(key: Key) {
        this.key = key;
        return this;
    }

    getDictionary() {
        return this.dictionary;
    }

    setDictionary(dictionary: Util.Dictionary) {
        this.dictionary = dictionary;
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
