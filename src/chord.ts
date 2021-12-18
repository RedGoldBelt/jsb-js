import Key from './key.js';
import Numeral from './numeral.js';
import Printable from './printable.js';
import Resolution from './resolution.js';
import Tone from './tone.js';
import Util from './util.js';

export default class Chord implements Printable {
  private static INVERSIONS = ['a', 'b', 'c', 'd'];

  base;
  modifier;
  inversion;
  relativeKey;

  constructor(base: Numeral | undefined, modifier: Util.Modifier, inversion: Util.Inversion, relativeKey: Numeral) {
    this.base = base;
    this.modifier = modifier;
    this.inversion = inversion;
    this.relativeKey = relativeKey;
  }

  static parse(string: string) {
    const result = string.match(
      /^((b|#|)(III|iii|VII|vii|II|ii|IV|iv|VI|vi|I|i|V|v))(o7|7|)([a-d])?(\/((b|#|)(III|iii|VII|vii|II|ii|IV|iv|VI|vi|I|i|V|v)))?$/
    );
    if (result === null) {
      throw `Could not parse chord '${string}'.`;
    }
    return new Chord(
      Numeral.parse(result[1]),
      result[4] as Util.Modifier,
      (result[5] ? Chord.INVERSIONS.indexOf(result[5]) : 0) as Util.Inversion,
      Numeral.parse(result[6] ? result[7] : 'I')
    );
  }

  resolve(key: Key) {
    if (this.base === undefined) {
      throw 'Cannot resolve null chord.';
    }
    if (this.relativeKey) {
      key = new Key(key.degree(this.relativeKey.degree), this.relativeKey.tonality);
    }

    const rootPitch =
      key.degree(this.base.degree).alterAccidental(this.base.accidental).semitones() - key.degree(0).semitones();
    const third = key.degree(this.base.degree + 2, rootPitch + (this.base.tonality ? 4 : 3));
    let fifth: Tone;
    let seventh: Tone | undefined;

    switch (this.modifier) {
      case '':
        fifth = key.degree(this.base.degree + 4);
        break;
      case 'o7':
        fifth = key.degree(this.base.degree + 4, rootPitch + 6);
        seventh = key.degree(this.base.degree + 6, rootPitch + 9);
        break;
      case '7':
        fifth = key.degree(this.base.degree + 4);
        seventh = key.degree(this.base.degree + 6);
        break;
    }

    return new Resolution(
      key.degree(this.base.degree).alterAccidental(this.base.accidental),
      third,
      fifth,
      seventh,
      this.inversion
    );
  }

  progression(dictionary: Util.Dictionary, type: Util.EventType) {
    if (this.base === undefined) {
      return dictionary.start[this.relativeKey.tonality ? 'major' : 'minor'].map(Chord.parse);
    }
    const specific = dictionary.specific?.[this.relativeKey.string()]?.[this.stringStem()] as string[];
    const specificOptions = specific?.map(Chord.parse) ?? [];
    const common = dictionary.common[this.relativeKey.tonality ? 'major' : 'minor'][this.stringStem()] as string[];
    const commonOptions =
      common?.map(string => {
        const chord = Chord.parse(string);
        chord.relativeKey = this.relativeKey;
        return chord;
      }) ?? [];

    const options = specificOptions?.concat(commonOptions) ?? commonOptions;
    switch (type) {
      case 'normal':
        return options;
      case 'cadence':
        return options.filter(chord => ['I', 'i', 'V', 'VI', 'vi'].includes(chord.stringStem()));
      case 'end':
        return options.filter(chord => ['I/I', 'I/i', 'V/I'].includes(chord.string()));
    }
  }

  stringStem() {
    return this.base?.string() + this.modifier + (this.inversion ? Chord.INVERSIONS[this.inversion] : '');
  }

  string() {
    let string = this.stringStem();
    string += '/' + this.relativeKey.string();
    return string;
  }
}
