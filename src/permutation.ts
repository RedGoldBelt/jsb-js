import Config from "./config.js";
import Event from "./event.js";
import Parts from "./parts.js";
import Realisation from "./realisation.js";
import Resolution from "./resolution.js";
import Util from "./util.js";

export default class Permutation extends Parts<Util.Inversion> {
    valid(config: Config, tonality: boolean, hasSeventh: boolean) {
        const distribution = [0, 0, 0, 0];

        for (const part of Util.PARTS) {
            ++distribution[this.get(part)];
        }

        if (distribution[0] === 0) {
            return false;
        }

        if (distribution[1] === 0) {
            return false;
        }

        if (tonality) {
            if (distribution[1] >= (config.doubledMajorThird ? 3 : 2)) {
                return false;
            }
        } else {
            if (distribution[1] >= (config.doubledMinorThird ? 3 : 2)) {
                return false;
            }
        }

        if (distribution[2] === 0 && !config.absentFifth) {
            return false;
        }

        if (distribution[3] === 0 && hasSeventh) {
            return false;
        }
        return true;
    }

    realise(config: Config, target: Realisation, event: Event, resolution: Resolution) {
        const s = event.getS().main()?.getPitch() ?? resolution.get(this.getS()).near(target.getS())[0];
        const a = event.getA().main()?.getPitch() ?? resolution.get(this.getA()).near(target.getA())[0];
        const t = event.getT().main()?.getPitch() ?? resolution.get(this.getT()).near(target.getT())[0];
        const b = event.getB().main()?.getPitch() ??
            resolution.get(this.getB()).near(target.getB()).filter(tone => config.tessiture.getB().includes(tone) && tone.semitones() <= s.semitones() - 10)[0];
        return new Realisation(s, a, t, b);
    }
}
