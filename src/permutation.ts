import Config from "./config.js";
import Configurable from "./configurable.js";
import Event from "./event.js";
import Parts from "./parts.js";
import Util from "./util.js";
import Resolution from "./resolution.js";
import Realisation from "./realisation.js";

export default class Permutation extends Parts<Util.Inversion> implements Configurable {
    private config = new Config();
    private score = Infinity;
    private realisation: Realisation | undefined;

    calculateScore(tonality: boolean, target: Realisation, event: Event, resolution: Resolution) {
        const distribution = [0, 0, 0, 0];

        for (const part of Util.PARTS) {
            ++distribution[this.get(part)];
        }

        if (distribution[0] === 0) {
            return this.setScore(Infinity);
        }

        if (distribution[1] === 0) {
            return this.setScore(Infinity);
        }

        if (tonality) {
            if (distribution[1] >= (this.getConfig().doubledMajorThird ? 3 : 2)) {
                return this.setScore(Infinity);
            }
        } else {
            if (distribution[1] >= (this.getConfig().doubledMinorThird ? 3 : 2)) {
                return this.setScore(Infinity);
            }
        }

        if (distribution[2] === 0 && !this.getConfig().absentFifth) {
            return this.setScore(Infinity);
        }

        if (distribution[3] === 0 && resolution.getSeventh()) {
            return this.setScore(Infinity);
        }

        return this.setScore(this.realise(this.getConfig(), target, event, resolution).getRealisation().score());
    }

    realise(config: Config, target: Realisation, event: Event, resolution: Resolution) {
        const s = event.getS().main()?.getPitch() ?? resolution.get(this.getS()).near(target.getS())[0];
        const a = event.getA().main()?.getPitch() ?? resolution.get(this.getA()).near(target.getA())[0];
        const t = event.getT().main()?.getPitch() ?? resolution.get(this.getT()).near(target.getT())[0];
        const b = event.getB().main()?.getPitch() ??
            resolution.get(this.getB()).near(target.getB()).filter(tone => config.tessiture.getB().includes(tone) && tone.semitones() <= s.semitones() - 10)[0];
        return this.setRealisation(new Realisation(s, a, t, b, this.getConfig(), target));
    }

    getConfig() {
        return this.config;
    }

    setConfig(config: Config) {
        this.config = config;
        return this;
    }

    getScore() {
        return this.score;
    }

    setScore(score: number) {
        this.score = score;
        return this;
    }

    getRealisation() {
        return this.realisation as Realisation;
    }

    setRealisation(realisation: Realisation) {
        this.realisation = realisation;
        return this;
    }
}
