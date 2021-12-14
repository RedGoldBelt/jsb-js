import Config from "./config.js";
import Parts from "./parts.js";
import Pitch from "./pitch.js";
import Util from "./util.js";

export default class Realisation extends Parts<Pitch> {
    private cache = Infinity;

    score(config: Config, target: Realisation, start: boolean) {
        for (const part of Util.PARTS) {
            if (!config.tessiture.get(part).includes(this.get(part))) {
                return this.setCache(Infinity);
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
            return this.setCache(Infinity);
        }

        if (!start) {
            if (
                this.parallel(target, "s", "a") ||
                this.parallel(target, "s", "t") ||
                this.parallel(target, "s", "b") ||
                this.parallel(target, "a", "t") ||
                this.parallel(target, "a", "b") ||
                this.parallel(target, "t", "b")
            ) {
                return this.setCache(Infinity);
            }
        }

        const score = Math.max(sa, at, tb) - Math.min(sa, at, tb) +
            Math.abs(s - target.getS().semitones()) +
            Math.abs(a - target.getA().semitones()) +
            Math.abs(t - target.getT().semitones()) +
            Math.abs(b - target.getB().semitones());
        return this.setCache(score);
    }

    parallel(target: Realisation, upper: Util.Part, lower: Util.Part) {
        const previousUpper = target.get(upper).semitones();
        const previousLower = target.get(lower).semitones()
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

    getCache() {
        return this.cache;
    }

    setCache(cache: number) {
        this.cache = cache;
        return this;
    }
}
