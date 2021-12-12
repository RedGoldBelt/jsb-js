import Inversions from "./inversions.js";
import Tone from "./tone.js";
import Util from "./util.js";

export default class Resolution extends Inversions<Tone> implements Util.Printable {
    private inversion: Util.Inversion;

    constructor(root: Tone, third: Tone, fifth: Tone, seventh: Tone | undefined, inversion: Util.Inversion) {
        super(root, third, fifth, seventh);
        this.inversion = inversion;
    }

    bass() {
        return this.get(this.inversion);
    }

    includes(tone: Tone) {
        return this.getRoot().equals(tone) || this.getThird().equals(tone) || this.getFifth().equals(tone) || !!this.getSeventh()?.equals(tone);
    }

    string() {
        const array = [this.getRoot(), this.getThird(), this.getFifth(), this.getSeventh()].filter(tone => tone).map(tone => tone?.string());
        array[this.inversion] = `{${array[this.inversion]}}`;
        return array.join(" ");
    }
}
