import Pitch from './pitch.js';
import Printable from './printable.js';

export default class Tone implements Printable {
  static ACCIDENTALS = ['', '#', 'x'];
  static {
    Tone.ACCIDENTALS[-2] = 'bb';
    Tone.ACCIDENTALS[-1] = 'b';
  }
  static LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  static PITCHES = [0, 2, 4, 5, 7, 9, 11];

  letter;
  accidental;

  constructor(letter: number, accidental: number) {
    this.letter = letter;
    this.accidental = accidental;
  }

  static parse(string: string) {
    const result = string.match(/^([A-G])(bb|x|b|#|)$/);
    if (result === null) {
      throw `Could not parse tone '${string}'.`;
    }
    return new Tone(Tone.LETTERS.indexOf(result[1]), Tone.ACCIDENTALS.indexOf(result[2]));
  }

  semitones() {
    return Tone.PITCHES[this.letter] + this.accidental;
  }

  equals(tone: Tone | undefined) {
    if (tone === undefined) {
      return false;
    }
    return this.letter === tone.letter && this.accidental === tone.accidental;
  }

  near(pitch: Pitch) {
    const tone1 = new Pitch(this, pitch.octave - 1);
    const tone2 = new Pitch(this, pitch.octave);
    const tone3 = new Pitch(this, pitch.octave + 1);
    return [tone1, tone2, tone3].sort(
      (l, r) => Math.abs(pitch.semitones() - l.semitones()) - Math.abs(pitch.semitones() - r.semitones())
    );
  }

  alterAccidental(accidental: number) {
    const altered = this.accidental + accidental;
    if (altered >= -2 && altered <= 2) {
      this.accidental = altered;
    }
    return this;
  }

  string() {
    return Tone.LETTERS[this.letter] + Tone.ACCIDENTALS[this.accidental];
  }
}
