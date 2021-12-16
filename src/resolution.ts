import Inversions from './inversions.js';
import Printable from './printable.js';
import Tone from './tone.js';
import Util from './util.js';

export default class Resolution extends Inversions<Tone> implements Printable {
  inversion: Util.Inversion;

  constructor(root: Tone, third: Tone, fifth: Tone, seventh: Tone | undefined, inversion: Util.Inversion) {
    super(root, third, fifth, seventh);
    this.inversion = inversion;
  }

  includes(tone: Tone) {
    return tone.equals(this.root) || tone.equals(this.third) || tone.equals(this.fifth) || tone.equals(this.seventh);
  }

  findInversion(tone: Tone) {
    return [this.root, this.third, this.fifth, this.seventh].findIndex(test => tone.equals(test)) as Util.Inversion;
  }

  string() {
    const array = [this.root, this.third, this.fifth, this.seventh].filter(tone => tone).map(tone => tone?.string());
    array[this.inversion] = `{${array[this.inversion]}}`;
    return array.join(' ');
  }
}
