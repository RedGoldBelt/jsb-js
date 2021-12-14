import Config from "./config.js";
import Event from "./event.js";
import Parts from "./parts.js";
import Realisation from "./realisation.js";
import Resolution from "./resolution.js";
import Util from "./util.js";

export default class Permutation extends Parts<Util.Inversion> {
    realise(config: Config, defined: Parts<boolean>, target: Realisation, event: Event, resolution: Resolution) {
        const s = defined.s ? event.s.main().getPitch() : resolution.get(this.s).near(target.s)[0];
        const a = defined.a ? event.a.main().getPitch() : resolution.get(this.a).near(target.a)[0];
        const t = defined.t ? event.t.main().getPitch() : resolution.get(this.t).near(target.t)[0];
        const b = defined.b ? event.b.main().getPitch() : resolution.get(this.b).near(target.b).filter(tone => config.tessiture.b.includes(tone) && tone.semitones() <= s.semitones() - 10)[0];
        return new Realisation(s, a, t, b);
    }
}
