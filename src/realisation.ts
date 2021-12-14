import Config from "./config.js";
import Configurable from "./configurable.js";
import Parts from "./parts.js";
import Pitch from "./pitch.js";
import Util from "./util.js";

export default class Realisation extends Parts<Pitch> implements Configurable {
    private config;
    private target;

    constructor(s: Pitch, a: Pitch, t: Pitch, b: Pitch, config: Config, target: Realisation | undefined) {
        super(s, a, t, b);
        this.config = config;
        this.target = target;
    }

    score() {
        for (const part of Util.PARTS) {
            if (!this.getConfig().tessiture.get(part).includes(this.get(part))) {
                return Infinity;
            }
        }

        const s = this.getS().semitones();
        const a = this.getA().semitones();
        const t = this.getT().semitones();
        const b = this.getB().semitones();

        const sa = s - a;
        const at = a - t;
        const tb = t - b;

        if (sa < 0 || at < 0 || tb < 0) {
            return Infinity;
        }

        if (this.getTarget().getTarget()) {
            if (
                this.parallel("s", "a") ||
                this.parallel("s", "t") ||
                this.parallel("s", "b") ||
                this.parallel("a", "t") ||
                this.parallel("a", "b") ||
                this.parallel("t", "b")
            ) {
                return Infinity;
            }
        }

        return Math.max(sa, at, tb) - Math.min(sa, at, tb) +
            Math.abs(s - this.getTarget().getS().semitones()) +
            Math.abs(a - this.getTarget().getA().semitones()) +
            Math.abs(t - this.getTarget().getT().semitones()) +
            Math.abs(b - this.getTarget().getB().semitones());
    }

    parallel(upper: Util.Part, lower: Util.Part) {
        const previousUpper = this.getTarget().get(upper).semitones();
        const previousLower = this.getTarget().get(lower).semitones()
        const currentUpper = this.get(upper).semitones();
        const currentLower = this.get(lower).semitones();
        const previousInterval = previousUpper - previousLower;
        const interval = currentUpper - currentLower;

        if (previousUpper === currentUpper) {
            return false;
        }

        if (previousInterval === 12 && interval === 12 || previousInterval === 24 && interval === 24) {
            return true;
        }

        if (previousInterval === 7 && interval === 7 || previousInterval === 19 && interval === 19) {
            return true;
        }

        return false;
    }

    getConfig() {
        return this.config;
    }

    setConfig(config: Config) {
        this.config = config;
        return this;
    }

    getTarget() {
        return this.target as Realisation;
    }

    setTarget(target: Realisation | undefined) {
        this.target = target;
        return this;
    }
}
