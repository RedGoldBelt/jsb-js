import Config from "./config.js";
import Event from "./event.js";
import Parts from "./parts.js";
import Realisation from "./realisation.js";
import Resolution from "./resolution.js";
import Util from "./util.js";

export default class Permutation extends Parts<Util.Inversion> {
    realise(config: Config, defined: Parts<boolean>, target: Realisation, event: Event, resolution: Resolution) {
        const s = defined.getS() ? event.getS().main().getPitch() : resolution.get(this.getS()).near(target.getS())[0];
        const a = defined.getA() ? event.getA().main().getPitch() : resolution.get(this.getA()).near(target.getA())[0];
        const t = defined.getT() ? event.getT().main().getPitch() : resolution.get(this.getT()).near(target.getT())[0];
        const b = defined.getB() ? event.getB().main().getPitch() : resolution.get(this.getB()).near(target.getB()).filter(tone => config.tessiture.getB().includes(tone) && tone.semitones() <= s.semitones() - 10)[0];
        return new Realisation(s, a, t, b);
    }
}
