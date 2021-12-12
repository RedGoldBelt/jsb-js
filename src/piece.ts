import Chord from "./chord.js";
import Dict from "./dictionary.js";
import Event from "./event.js";
import Group from "./group.js";
import Key from "./key.js";
import Numeral from "./numeral.js";
import Permutation from "./permutation.js";
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
                this.getBars()[barIndex][eventIndex].set(part, Group.parse(event));
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
        const previousEvent = this.previousEvent();
        const event = this.event();
        const previousChord = previousEvent?.getChord() ?? new Chord(undefined, "", 0, new Numeral(0, 0, this.key.getTonality()));

        // Compute chord options and filter if the event type is "cadence" or "end"
        let chordOptions = previousChord.progression(this.dictionary);
        if (event.getType() === "cadence") {
            chordOptions.filter(chord => ["I", "i", "V", "Vb", "VI", "vi"].includes(chord.stringStem()));
        } else if (event.getType() === "end") {
            chordOptions.filter(chord => ["I/I", "I/i", "V/I"].includes(chord.string()))
        }

        // Try each chord
        while (event.map < chordOptions.length) {
            const chord = chordOptions[event.map++];
            const resolution = chord.resolve(this.key);
            event.clear();

            const target = new Util.Target(
                previousEvent?.getS().at(-1).getPitch() ?? Pitch.parse("Gb4"),
                previousEvent?.getA().at(-1).getPitch() ?? Pitch.parse("D4"),
                previousEvent?.getT().at(-1).getPitch() ?? Pitch.parse("B3"),
                previousEvent?.getB().at(-1).getPitch() ?? Pitch.parse("Eb3")
            );


            if (!event.fits(resolution)) {
                continue;
            }

            if (!event.getCache().getB()) {
                const options = resolution.bass().near(target.getB());
                const pitch = options.filter(tone => tone.semitones() >= 28 && tone.semitones() <= 48 && tone.semitones() <= event.getS().main().getPitch().semitones() - 10)[0];
                event.setB(pitch.group(event.duration()));
            } else if (!event.getB().main().getPitch().getTone().equals(resolution.bass())) {
                continue;
            }

            if (previousChord.getInversion() === 2 && this.previousPreviousEvent()?.getChord()?.string() === chord.string()) {
                continue;
            }

            const quotas = resolution.getSeventh() ? [1, 1, 1, 1] : [2, 1, 2, 0];

            for (const part of Util.PARTS) {
                const array = [resolution.getRoot(), resolution.getThird(), resolution.getFifth(), resolution.getSeventh()].filter(tone => tone) as Tone[];
                const inversion = array.findIndex((tone: Tone) => tone.equals(event.get(part).main()?.getPitch().getTone()));
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

            let permutations: Permutation[];
            const ones = quotas.map((quota, inversion) => quota === 1 ? resolution.get(inversion as Util.Inversion) : undefined).filter(tone => tone !== undefined) as Tone[];

            const s = event.getS().main().getPitch();
            const b = event.getB().main().getPitch();


            if (!event.getCache().getA() && !event.getCache().getT()) {
                let two = resolution.get(quotas.findIndex(quota => quota === 2) as Util.Inversion);
                switch (ones.length as 1 | 2 | 3) {
                    case 1:
                        const permutation1 = new Permutation(s, ones[0].near(target.getA())[0], two.near(target.getT())[0], b);
                        const permutation2 = new Permutation(s, two.near(target.getA())[0], ones[0].near(target.getT())[0], b);
                        const permutation3 = new Permutation(s, two.near(target.getA())[0], two.near(target.getT())[0], b);
                        permutations = [permutation1, permutation2, permutation3].sort((l, r) => l.calculateScore(this.previousEvent()) - r.calculateScore(this.previousEvent()));
                        break;
                    case 2:
                        const permutation4 = new Permutation(s, ones[0].near(target.getA())[0], ones[1].near(target.getT())[0], b);
                        const permutation5 = new Permutation(s, ones[1].near(target.getA())[0], ones[0].near(target.getT())[0], b);
                        permutations = [permutation4, permutation5].sort((l, r) => l.calculateScore(this.previousEvent()) - r.calculateScore(this.previousEvent()));
                        break;
                    case 3:
                        const permutation6 = new Permutation(s, ones[0].near(target.getA())[0], ones[1].near(target.getT())[0], b);
                        const permutation7 = new Permutation(s, ones[1].near(target.getA())[0], ones[0].near(target.getT())[0], b);
                        const permutation8 = new Permutation(s, ones[1].near(target.getA())[0], ones[2].near(target.getT())[0], b);
                        const permutation9 = new Permutation(s, ones[2].near(target.getA())[0], ones[1].near(target.getT())[0], b);
                        permutations = [permutation6, permutation7, permutation8, permutation9].sort((l, r) => l.calculateScore(this.previousEvent()) - r.calculateScore(this.previousEvent()));
                        break;
                }
            } else if (event.getCache().getA() && !event.getCache().getT()) {
                const a = event.getA().main().getPitch();
                if (ones.length === 1) {
                    permutations = [new Permutation(s, a, ones[0].near(target.getT())[0], b)];
                } else {
                    permutations = [new Permutation(s, a, ones[0].near(target.getT())[0], b), new Permutation(s, a, ones[1].near(target.getT())[0], b)].sort((l, r) => l.calculateScore(this.previousEvent()) - r.calculateScore(this.previousEvent()));
                }
            } else if (!event.getCache().getA() && event.getCache().getT()) {
                const t = event.getT().main().getPitch();
                if (ones.length === 1) {
                    permutations = [new Permutation(s, ones[0].near(target.getA())[0], t, b)];
                } else {
                    permutations = [new Permutation(s, ones[0].near(target.getA())[0], t, b), new Permutation(s, ones[1].near(target.getA())[0], t, b)].sort((l, r) => l.calculateScore(this.previousEvent()) - r.calculateScore(this.previousEvent()));
                }
            } else {
                permutations = [new Permutation(s, event.getA().main().getPitch(), event.getT().main().getPitch(), b)];
            }

            for (const permutation of permutations) {
                if (permutation.getScore() === Infinity) {
                    continue;
                }

                event.setA(permutation.getA().group(event.duration())).setT(permutation.getT().group(event.duration()));

                if (
                    this.checkParallel(event, previousEvent, "s", "a") ||
                    this.checkParallel(event, previousEvent, "s", "t") ||
                    this.checkParallel(event, previousEvent, "s", "b") ||
                    this.checkParallel(event, previousEvent, "a", "t") ||
                    this.checkParallel(event, previousEvent, "a", "b") ||
                    this.checkParallel(event, previousEvent, "t", "b")) {
                    continue;
                }

                event.setChord(chord);
                this.incrementTime();
                return;
            }
            continue;
        }
        event.clear().map = 0;
        this.decrementTime();
    }

    private checkParallel(event: Event, previousEvent: Event | undefined, upper: Util.Part, lower: Util.Part) {
        if (previousEvent === undefined) {
            return false;
        }
        const previousUpper = previousEvent.get(upper).at(-1).getPitch().semitones();
        const previousLower = previousEvent.get(lower).at(-1).getPitch().semitones()
        const currentUpper = event.get(upper).at(0).getPitch().semitones();
        const currentLower = event.get(lower).at(0).getPitch().semitones();
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
