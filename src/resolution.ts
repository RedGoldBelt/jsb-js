import Inversions from "./inversions.js";
import Printable from "./printable.js";
import Tone from "./tone.js";
import Util from "./util.js";

export default class Resolution extends Inversions<Tone> implements Printable {
    private inversion: Util.Inversion;

    constructor(root: Tone, third: Tone, fifth: Tone, seventh: Tone | undefined, inversion: Util.Inversion) {
        super(root, third, fifth, seventh);
        this.inversion = inversion;
    }

    includes(tone: Tone) {
        return tone.equals(this.getRoot()) || tone.equals(this.getThird()) || tone.equals(this.getFifth()) || tone.equals(this.getSeventh());
    }

    getInversion() {
        return this.inversion;
    }

    setInversion(inversion: Util.Inversion) {
        this.inversion = inversion;
        return this;
    }

    findInversion(tone: Tone) {
        return [this.getRoot(), this.getThird(), this.getFifth(), this.getSeventh()].findIndex(test => tone.equals(test)) as Util.Inversion;
    }

    string() {
        const array = [this.getRoot(), this.getThird(), this.getFifth(), this.getSeventh()].filter(tone => tone).map(tone => tone?.string());
        array[this.inversion] = `{${array[this.inversion]}}`;
        return array.join(" ");
    }
}
