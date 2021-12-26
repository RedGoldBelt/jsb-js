import Printable from './printable.js';
import Tone from './tone.js';

export default class Symbol implements Printable {
  static NUMERALS = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii'];

  accidental;
  degree;
  tonality;

  constructor(accidental: number, degree: number, tonality: boolean) {
    this.accidental = accidental;
    this.degree = degree;
    this.tonality = tonality;
  }

  static parse(string: string) {
    const result = string.match(/^(b|#|)(III|iii|VII|vii|II|ii|IV|iv|VI|vi|I|i|V|v)$/);
    if (result === null) {
      throw `Could not parse symbol '${string}'.`;
    }
    return new Symbol(
      Tone.ACCIDENTALS.indexOf(result[1]),
      Symbol.NUMERALS.indexOf(result[2].toLowerCase()),
      result[2] === result[2].toUpperCase()
    );
  }

  string() {
    return (
      Tone.ACCIDENTALS[this.accidental] + Symbol.NUMERALS[this.degree][this.tonality ? 'toUpperCase' : 'toLowerCase']()
    );
  }
}
