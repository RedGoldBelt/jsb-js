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
    private bars: Util.Bar[] = [];
    private time: Util.Time = { barIndex: 0, eventIndex: 0 };
    private maxTime: Util.Time = { barIndex: 0, eventIndex: 0 };
    private key = Key.parse("C major");
    private dictionary = Dict.FULL;

    parse(string: string, part: Util.Part) {
        const split = string.split(/[[|\]]/).filter(bar => bar !== "").map(bar => bar.split(" ").filter(group => group !== ""));
        split.forEach((bar, barIndex) => {
            this.getBars()[barIndex] ??= [];
            bar.forEach((event, eventIndex) => {
                let type: Util.EventType;
                switch (event.charAt(event.length - 1)) {
                    case ";": type = "cadence"; break;
                    case ":": type = "end"; break;
                    default: type = "normal"; break;
                }
                if (type !== "normal") {
                    event = event.slice(0, -1);
                }
                this.getBars()[barIndex][eventIndex] ??= Event.empty(type);
                this.getBars()[barIndex][eventIndex].setPart(part, Group.parse(event));
            });
        });
        return this;
    }

    private previousPreviousEvent() {
        let { barIndex: bar, eventIndex: event } = this.getTime();
        if (--event < 0) {
            if (--bar < 0) {
                return undefined;
            }
            event = this.getBars()[bar].length - 1;
        }
        if (--event < 0) {
            if (--bar < 0) {
                return undefined;
            }
            event = this.getBars()[bar].length - 1;
        }
        return this.getBars()[bar][event];
    }

    private previousEvent() {
        let { barIndex: bar, eventIndex: event } = this.getTime();
        if (--event < 0) {
            if (--bar < 0) {
                return undefined;
            }
            event = this.getBars()[bar].length - 1;
        }
        return this.getBars()[bar][event];
    }

    private event() {
        return this.getBars()[this.getTime().barIndex][this.getTime().eventIndex];
    }

    harmonise() {
        this.validate().setMaxTime({ barIndex: 0, eventIndex: 0 }).setTime({ barIndex: 0, eventIndex: 0 });
        while (this.getTime().barIndex < this.getBars().length) {
            if (this.getTime().barIndex < 0) {
                throw "Failed to harmonise.";
            }
            this.calculateMaxTime().step();
        }
        return this;
    }

    private validate() {
        for (let bar = 0; bar < this.getBars().length; ++bar) {
            for (const event of this.getBars()[bar]) {
                if (!event.getS().main()) {
                    throw "Soprano line is not defined.";
                }
                if (!event.validate()) {
                    throw "Not all parts have the same duration.";
                }
                event.cacheState();
            }
        }
        return this;
    }

    private step() {
        const event = this.getBars()[this.getTime().barIndex][this.getTime().eventIndex];
        const previousChord = this.previousEvent()?.getChord() ?? new Chord(undefined, "", 0, new Numeral(0, 0, this.key.getTonality()));

        // Compute chord options and filter if the event type is "cadence" or "end"
        let chordOptions = previousChord.progression(this.dictionary);
        if (this.event().getType() === "cadence") {
            chordOptions.filter(chord => ["I", "i", "V", "Vb", "VI", "vi"].includes(chord.stringStem()));
        } else if (this.event().getType() === "end") {
            chordOptions.filter(chord => ["I/I", "I/i", "V/I"].includes(chord.string()))
        }

        // Try each chord
        for (; this.event().map < chordOptions.length; ++this.event().map) {
            const chord = chordOptions[this.event().map];
            const resolution = chord.resolve(this.key);

            const target = {
                s: this.previousEvent()?.getS().at(-1).getPitch() ?? Pitch.parse("Gb4"),
                a: this.previousEvent()?.getA().at(-1).getPitch() ?? Pitch.parse("D4"),
                t: this.previousEvent()?.getT().at(-1).getPitch() ?? Pitch.parse("B3"),
                b: this.previousEvent()?.getB().at(-1).getPitch() ?? Pitch.parse("Eb3")
            }

            if (!event.fits(resolution)) {
                this.event().clear();
                continue;
            }

            if (!event.getCache().b) {
                const options = resolution.bass().near(target.b);
                const pitch = options.filter(tone => tone.semitones() >= 28 && tone.semitones() <= 48 && tone.semitones() <= this.event().getS().main().getPitch().semitones() - 10)[0];
                this.event().setB(pitch.group(this.event().duration()));
            }

            if (event.getCache().b && !event.getB().main().getPitch().getTone().equals(resolution.bass())) {
                this.event().clear();
                continue;
            }

            if (previousChord.getInversion() === 2 && this.previousPreviousEvent()?.getChord()?.string() === chord.string()) {
                this.event().clear();
                continue;
            }

            const quotas = resolution.getSeventh() ? [1, 1, 1, 1] : [2, 1, 2, 0];

            for (const part of Util.PARTS) {
                const array = [resolution.getRoot(), resolution.getThird(), resolution.getFifth(), resolution.getSeventh()].filter(tone => tone) as Tone[];
                const inversion = array.findIndex((tone: Tone) => tone.equals(this.event().getPart(part).main()?.getPitch().getTone()));
                if (inversion !== -1) {
                    --quotas[inversion];
                }
            }

            if (resolution.getSeventh() === undefined) {
                if (quotas[0] === 0) {
                    quotas[2] = 1;
                    if (quotas[2] === 0) {
                        this.event().clear();
                        continue;
                    }
                }
                if (quotas[2] === 0) {
                    quotas[0] = 1;
                }
            }

            if (quotas.some(quota => quota < 0)) {
                this.event().clear();
                continue;
            }

            let permutations: Util.Permutation[];
            const ones = quotas.map((quota, inversion) => quota === 1 ? resolution.at(inversion as Util.Inversion) : undefined).filter(tone => tone !== undefined) as Tone[];

            let a: Pitch;
            let t: Pitch;

            if (!event.getCache().a && !event.getCache().t) {
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
            } else if (event.getCache().a && !event.getCache().t) {
                a = this.event().getA().main().getPitch();
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
            } else if (!event.getCache().a && event.getCache().t) {
                t = this.event().getT().main().getPitch();
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
                    a: a = this.event().getA().main().getPitch(),
                    t: t = this.event().getT().main().getPitch(),
                    score: this.score(a, t)
                }];
            }

            for (const permutation of permutations) {
                if (permutation.score === Infinity) {
                    this.event().clear();
                    continue;
                }

                this.event()
                    .setA(permutation.a.group(this.event().duration()))
                    .setT(permutation.t.group(this.event().duration()));

                if (
                    this.checkParallel("s", "a") ||
                    this.checkParallel("s", "t") ||
                    this.checkParallel("s", "b") ||
                    this.checkParallel("a", "t") ||
                    this.checkParallel("a", "b") ||
                    this.checkParallel("t", "b")) {
                    this.event().clear();
                    continue;
                }

                this.event().setChord(chord);
                this.incrementTime();
                return;
            }
            this.event().clear();
            continue;
        }
        this.event().clear().map = 0;
        this.decrementTime();
        if (this.getTime().barIndex >= 0) {
            ++this.event().map;
        }
        return;
    }

    private score(aPitch: Pitch, tPitch: Pitch) {
        const s = this.event().getS().main().getPitch().semitones();
        const a = aPitch.semitones();
        const t = tPitch.semitones();
        const b = this.event().getB().main().getPitch().semitones();
        const previousA = this.previousEvent()?.getA().at(-1).getPitch() ?? Pitch.parse("D4");
        const previousT = this.previousEvent()?.getT().at(-1).getPitch() ?? Pitch.parse("B3");
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
        const previousEvent = this.previousEvent();
        if (previousEvent === undefined) {
            return false;
        }
        const previousUpper = previousEvent.getPart(upper).at(-1).getPitch().semitones();
        const previousLower = previousEvent.getPart(lower).at(-1).getPitch().semitones()
        const currentUpper = this.event().getPart(upper).at(0).getPitch().semitones();
        const currentLower = this.event().getPart(lower).at(0).getPitch().semitones();
        const previousInterval = (previousUpper - previousLower) % 12;
        const interval = (currentUpper - currentLower) % 12;
        return (previousInterval === 0 && interval === 0 || previousInterval === 7 && interval === 7) && previousUpper !== currentUpper && previousLower !== currentLower;
    }

    getBars() {
        return this.bars;
    }

    setBars(bars: Util.Bar[]) {
        this.bars = bars;
        return this;
    }

    getTime() {
        return this.time;
    }

    setTime(time: Util.Time) {
        this.time = time;
        return this;
    }

    decrementTime() {
        if (--this.getTime().eventIndex < 0) {
            this.getTime().eventIndex = this.getBars()[--this.getTime().barIndex]?.length - 1;
        }
        return this;
    }

    incrementTime() {
        if (++this.getTime().eventIndex >= this.getBars()[this.getTime().barIndex].length) {
            ++this.getTime().barIndex;
            this.getTime().eventIndex = 0;
        }
        return this;
    }

    getMaxTime() {
        return this.maxTime;
    }

    setMaxTime(maxTime: Util.Time) {
        this.maxTime = maxTime;
        return this;
    }

    calculateMaxTime() {
        if (this.getTime().barIndex > this.getMaxTime().barIndex) {
            this.setMaxTime({ ...this.getTime() });
        } else if (this.getTime().barIndex === this.getMaxTime().barIndex && this.getTime().eventIndex >= this.getMaxTime().eventIndex) {
            this.getMaxTime().eventIndex = this.getTime().eventIndex;
        }
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
        return `[${this.getBars().map(bar => bar.map(event => event.getS().string().padEnd(8)).join(" ")).join("|")}]
[${this.getBars().map(bar => bar.map(event => event.getA().string().padEnd(8)).join(" ")).join("|")}]
[${this.getBars().map(bar => bar.map(event => event.getT().string().padEnd(8)).join(" ")).join("|")}]
[${this.getBars().map(bar => bar.map(event => event.getB().string().padEnd(8)).join(" ")).join("|")}]
[${this.getBars().map(bar => bar.map(event => event.getChord()?.string().padEnd(8)).join(" ")).join("|")}]`
    }
}
