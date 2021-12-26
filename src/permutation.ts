import Config from './config.js';
import Parts, { Part } from './parts.js';
import Pitch from './pitch.js';

export default class Permutation extends Parts<Pitch> {
  cache = Infinity;

  score(config: Config, target: Permutation, start: boolean) {
    if (!config.tessiture.s.includes(this.s)) {
      return (this.cache = Infinity);
    }
    if (!config.tessiture.a.includes(this.a)) {
      return (this.cache = Infinity);
    }
    if (!config.tessiture.t.includes(this.t)) {
      return (this.cache = Infinity);
    }
    if (!config.tessiture.b.includes(this.b)) {
      return (this.cache = Infinity);
    }

    const s = this.s.semitones();
    const a = this.a.semitones();
    const t = this.t.semitones();
    const b = this.b.semitones();

    const sa = s - a;
    const at = a - t;
    const tb = t - b;

    if (sa < 0 || at < 0 || tb < 0) {
      return (this.cache = Infinity);
    }

    if (!start) {
      if (
        this.parallel(target, 's', 'a') ||
        this.parallel(target, 's', 't') ||
        this.parallel(target, 's', 'b') ||
        this.parallel(target, 'a', 't') ||
        this.parallel(target, 'a', 'b') ||
        this.parallel(target, 't', 'b')
      ) {
        return (this.cache = Infinity);
      }
    }

    const score =
      Math.max(sa, at, tb) -
      Math.min(sa, at, tb) +
      Math.abs(s - target.s.semitones()) +
      Math.abs(a - target.a.semitones()) +
      Math.abs(t - target.t.semitones()) +
      Math.abs(b - target.b.semitones());
    return (this.cache = score);
  }

  parallel(target: Permutation, upper: Part, lower: Part) {
    const previousUpper = target.get(upper).semitones();
    const previousLower = target.get(lower).semitones();
    const currentUpper = this.get(upper).semitones();
    const currentLower = this.get(lower).semitones();
    const previousInterval = previousUpper - previousLower;
    const interval = currentUpper - currentLower;

    if (previousUpper === currentUpper) {
      return false;
    }

    if ((previousInterval === 12 && interval === 12) || (previousInterval === 24 && interval === 24)) {
      return true;
    }

    if ((previousInterval === 7 && interval === 7) || (previousInterval === 19 && interval === 19)) {
      return true;
    }

    return false;
  }
}
