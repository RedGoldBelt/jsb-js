import Chord from "./chord.js";
import Config from "./config.js";
import Configurable from "./configurable.js";
import Event from "./event.js";
import Group from "./group.js";
import Key from "./key.js";
import Numeral from "./numeral.js";
import Parts from "./parts.js";
import Util from "./util.js";
import Printable from "./printable.js";
import Permutation from "./permutation.js";
import Realisation from "./realisation.js";
import Pitch from "./pitch.js";

export default class Piece extends Configurable implements Printable, Configurable {
    private cache: Util.Bar[] = [];
    private bars: Util.Bar[] = [];
    private time: Util.Time = { barIndex: 0, eventIndex: 0 };
    private maxTime: Util.Time = { barIndex: 0, eventIndex: 0 };
    private key = Key.parse("C major");
    private config = new Config();

    parse(string: string, part: Util.Part) {
        const split = string.split(/[[|\]]/).filter(bar => bar !== "").map(bar => bar.split(" ").filter(group => group !== ""));
        split.forEach((bar, barIndex) => {
            this.getCache()[barIndex] ??= [];
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
                this.getCache()[barIndex][eventIndex] ??= Event.empty(type);
                this.getCache()[barIndex][eventIndex].set(part, Group.parse(event));
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
        this.initialize().setTime({ barIndex: 0, eventIndex: 0 }).setMaxTime({ barIndex: 0, eventIndex: 0 });
        while (this.getTime().barIndex < this.getBars().length) {
            if (this.getTime().barIndex < 0) {
                throw "Failed to harmonise.";
            }
            this.calculateMaxTime().step();
        }
        return this;
    }

    private initialize() {
        const bars = [];
        for (const cacheBar of this.getCache()) {
            const bar: Util.Bar = [];
            for (const cacheEvent of cacheBar) {
                if (!cacheEvent.validate()) {
                    throw "Not all parts have the same duration.";
                }
                bar.push(Event.empty(cacheEvent.getType()));
            }
            bars.push(bar);
        }
        this.setBars(bars);
        return this;
    }

    private step() {
        const cacheEvent = this.getCache()[this.getTime().barIndex][this.getTime().eventIndex];
        const previousEvent = this.previousEvent();
        const event = this.event();
        const previousChord = previousEvent?.getChord() ?? new Chord(undefined, "", 0, new Numeral(0, 0, this.key.getTonality()));
        const chordOptions = previousChord.progression(this.getConfig().dictionary, event.getType());

        while (event.map < chordOptions.length) {
            event.setS(cacheEvent.getS()).setA(cacheEvent.getA()).setT(cacheEvent.getT()).setB(cacheEvent.getB());
            const chord = chordOptions[event.map++];
            const resolution = chord.resolve(this.key);

            const defined = new Parts<boolean>(
                event.getS().main() !== undefined,
                event.getA().main() !== undefined,
                event.getT().main() !== undefined,
                event.getB().main() !== undefined,
            );

            if (defined.getB() && !event.getB().main().getPitch().getTone().equals(resolution.get(resolution.getInversion()))) {
                continue;
            }

            if (!event.fits(resolution)) {
                continue;
            }

            if (previousChord.getInversion() === 2 && this.previousPreviousEvent()?.getChord()?.string() === chord.string()) {
                continue;
            }

            const target = previousEvent ? new Realisation(
                previousEvent.getS().at(-1).getPitch(),
                previousEvent.getA().at(-1).getPitch(),
                previousEvent.getT().at(-1).getPitch(),
                previousEvent.getB().at(-1).getPitch(),
            ) : new Realisation(Pitch.parse("Gb4"), Pitch.parse("D4"), Pitch.parse("B3"), Pitch.parse("Eb3"));

            const sInversion = resolution.findInversion(event.getS().main().getPitch().getTone());
            const bInversion = resolution.getInversion();

            const permutations: Realisation[] = [];
            const tonality = (chord.getBase() as Numeral).getTonality();
            const hasSeventh = resolution.getSeventh() !== undefined;

            for (const aInversion of Util.INVERSIONS) {
                for (const tInversion of Util.INVERSIONS) {
                    const distribution = [0, 0, 0, 0];
                    ++distribution[sInversion];
                    ++distribution[aInversion];
                    ++distribution[tInversion];
                    ++distribution[bInversion];

                    if (distribution[0] === 0 || distribution[1] === 0 || distribution[2] === 0 && !this.getConfig().absentFifth || distribution[3] === 0 && hasSeventh) {
                        continue;
                    }

                    if (tonality) {
                        if (distribution[1] >= (this.getConfig().doubledMajorThird ? 3 : 2)) {
                            continue;
                        }
                    } else {
                        if (distribution[1] >= (this.getConfig().doubledMinorThird ? 3 : 2)) {
                            continue;
                        }
                    }
                    permutations.push(new Permutation(sInversion, aInversion, tInversion, bInversion).realise(this.getConfig(), defined, target, event, resolution).score(this.getConfig(), target, !previousEvent));
                }
            }

            if (permutations.length === 0) {
                continue;
            }

            const realisation = permutations.reduce((l, r) => (l.getCache() < r.getCache()) ? l : r);

            const duration = event.duration();
            for (const part of Util.PARTS) {
                if (!defined.get(part)) {
                    event.set(part, realisation.get(part).group(duration));
                }
            }

            event.setChord(chord);
            this.incrementTime();
            return;
        }
        event.map = 0;
        this.decrementTime();
    }

    getCache() {
        return this.cache;
    }

    setCache(cache: Util.Bar[]) {
        this.cache = cache;
        return this;
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

    getConfig() {
        return this.config;
    }

    setConfig(config: Config) {
        this.config = config;
        return this;
    }

    editConfig(property: keyof Config, value: any) {
        this.getConfig()[property] = value;
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
