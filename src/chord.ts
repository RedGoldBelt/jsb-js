import { Inversion } from './inversions.js';
import Key from './key.js';
import Symbol from './symbol.js';
import Printable from './printable.js';
import Resolution from './resolution.js';
import Tone from './tone.js';

export type Modifier = '' | '7' | 'o7';

export default class Chord implements Printable {
  private static INVERSIONS = ['a', 'b', 'c', 'd'];

  base;
  modifier;
  inversion;
  relativeKey;

  constructor(base: Symbol | undefined, modifier: Modifier, inversion: Inversion, relativeKey: Symbol) {
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
      Symbol.parse(result[1]),
      result[4] as Modifier,
      (result[5] ? Chord.INVERSIONS.indexOf(result[5]) : 0) as Inversion,
      Symbol.parse(result[6] ? result[7] : 'I')
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

  stringStem() {
    return this.base?.string() + this.modifier + (this.inversion ? Chord.INVERSIONS[this.inversion] : '');
  }

  string() {
    let string = this.stringStem();
    string += '/' + this.relativeKey.string();
    return string;
  }
}
