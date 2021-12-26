import Chord from './chord.js';
import Config from './config.js';
import Event, { EventType } from './event.js';
import Group from './group.js';
import { Inversion } from './inversions.js';
import Symbol from './symbol.js';
import Parts, { Part } from './parts.js';
import Permutation from './permutation.js';
import Pitch from './pitch.js';
import Printable from './printable.js';

export type Bar = Event[];

export interface Time {
  barIndex: number;
  eventIndex: number;
}

export default class Piece implements Printable {
  private cache: Bar[] = [];
  private bars: Bar[] = [];
  private time: Time = { barIndex: 0, eventIndex: 0 };
  private maxTime: Time = { barIndex: 0, eventIndex: 0 };
  private config = new Config();

  constructor(config: Config) {
    this.configure(config);
  }

  parse(string: string, part: Part) {
    const bars = string
      .split(/[[|\]]/)
      .filter(bar => bar !== '')
      .map(bar => bar.split(' ').filter(group => group !== ''));
    for (let barIndex = 0; barIndex < bars.length; ++barIndex) {
      const bar = bars[barIndex];
      this.cache[barIndex] ??= [];
      for (let eventIndex = 0; eventIndex < bar.length; ++eventIndex) {
        const event = bar[eventIndex];
        let type: EventType;
        switch (event.charAt(event.length - 1)) {
          case ';':
            type = 'cadence';
            break;
          case ':':
            type = 'end';
            break;
          default:
            type = 'normal';
            break;
        }
        this.cache[barIndex][eventIndex] ??= Event.empty(type);
        this.cache[barIndex][eventIndex].set(part, Group.parse(type === 'normal' ? event : event.slice(0, -1)));
      }
    }
    return this;
  }

  private previousPreviousEvent() {
    let { barIndex: bar, eventIndex: event } = this.time;
    if (--event < 0) {
      if (--bar < 0) {
        return undefined;
      }
      event = this.bars[bar].length - 1;
    }
    if (--event < 0) {
      if (--bar < 0) {
        return undefined;
      }
      event = this.bars[bar].length - 1;
    }
    return this.bars[bar][event];
  }

  private previousEvent() {
    let { barIndex: bar, eventIndex: event } = this.time;
    if (--event < 0) {
      if (--bar < 0) {
        return undefined;
      }
      event = this.bars[bar].length - 1;
    }
    return this.bars[bar][event];
  }

  harmonise() {
    this.bars = this.cache.map(bar => bar.map(event => Event.empty(event.type)));
    this.time = { barIndex: 0, eventIndex: 0 };
    this.maxTime = { barIndex: 0, eventIndex: 0 };
    while (this.time.barIndex < this.bars.length) {
      if (this.time.barIndex < 0) {
        throw 'Failed to harmonise.';
      }
      this.calculateMaxTime().step();
    }
    return this;
  }

  private step() {
    const cacheEvent = this.cache[this.time.barIndex][this.time.eventIndex];
    const previousEvent = this.previousEvent();
    const event = this.bars[this.time.barIndex][this.time.eventIndex];
    const previousChord =
      previousEvent?.chord ?? new Chord(undefined, '', 0, new Symbol(0, 0, this.config.key.tonality));
    const chordOptions = this.config.dictionary.progression(previousChord, event.type);

    while (event.map < chordOptions.length) {
      event.s = cacheEvent.s;
      event.a = cacheEvent.a;
      event.t = cacheEvent.t;
      event.b = cacheEvent.b;
      const chord = chordOptions[event.map++];
      const resolution = chord.resolve(this.config.key);

      const defined = new Parts<boolean>(
        event.s.main() !== undefined,
        event.a.main() !== undefined,
        event.t.main() !== undefined,
        event.b.main() !== undefined
      );

      if (defined.b && !event.b.main().pitch.tone.equals(resolution.get(resolution.inversion))) {
        continue;
      }

      if (!event.fits(resolution)) {
        continue;
      }

      if (previousChord.inversion === 2 && this.previousPreviousEvent()?.chord?.string() === chord.string()) {
        continue;
      }

      const target = previousEvent
        ? new Permutation(
            previousEvent.s.at(-1).pitch,
            previousEvent.a.at(-1).pitch,
            previousEvent.t.at(-1).pitch,
            previousEvent.b.at(-1).pitch
          )
        : new Permutation(Pitch.parse('Gb4'), Pitch.parse('D4'), Pitch.parse('B3'), Pitch.parse('Eb3'));

      const defaultInversions = [0, 1, 2, 3] as Inversion[];
      const sInversions = defined.s ? [resolution.findInversion(event.s.main().pitch.tone)] : defaultInversions;
      const aInversions = defined.a ? [resolution.findInversion(event.a.main().pitch.tone)] : defaultInversions;
      const tInversions = defined.t ? [resolution.findInversion(event.t.main().pitch.tone)] : defaultInversions;
      const bInversion = resolution.inversion;

      const permutations: Permutation[] = [];
      const tonality = (chord.base as Symbol).tonality;
      const hasSeventh = resolution.seventh !== undefined;

      for (const sInversion of sInversions) {
        for (const aInversion of aInversions) {
          for (const tInversion of tInversions) {
            const frequencies = [0, 0, 0, 0];
            ++frequencies[sInversion];
            ++frequencies[aInversion];
            ++frequencies[tInversion];
            ++frequencies[bInversion];

            if (
              frequencies[0] === 0 ||
              frequencies[1] === 0 ||
              (frequencies[2] === 0 && !this.config.absentFifth) ||
              (frequencies[3] === 0 && hasSeventh) ||
              (frequencies[3] !== 0 && !hasSeventh)
            ) {
              continue;
            }

            if (tonality) {
              if (frequencies[1] >= (this.config.doubledMajorThird ? 3 : 2)) {
                continue;
              }
            } else {
              if (frequencies[1] >= (this.config.doubledMinorThird ? 3 : 2)) {
                continue;
              }
            }

            const s = defined.s
              ? event.s.main().pitch
              : resolution
                  .get(sInversion)
                  .near(target.s)
                  .filter(tone => this.config.tessiture.s.includes(tone))[0];
            const a = defined.a ? event.a.main().pitch : resolution.get(aInversion).near(target.a)[0];
            const t = defined.t ? event.t.main().pitch : resolution.get(tInversion).near(target.t)[0];
            const b = defined.b
              ? event.b.main().pitch
              : resolution
                  .get(bInversion)
                  .near(target.b)
                  .filter(tone => this.config.tessiture.b.includes(tone) && tone.semitones() <= s.semitones() - 10)[0];
            if (!b) {
              continue;
            }
            const permutation = new Permutation(s, a, t, b);

            if (permutation.score(this.config, target, !previousEvent) === Infinity) {
              continue;
            }
            permutations.push(permutation);
          }
        }
      }

      if (permutations.length === 0) {
        continue;
      }

      const permutation = permutations.reduce((l, r) => (l.cache < r.cache ? l : r));

      const duration = event.duration();

      if (!defined.s) {
        event.s = permutation.s.group(duration);
      }
      if (!defined.a) {
        event.a = permutation.a.group(duration);
      }
      if (!defined.t) {
        event.t = permutation.t.group(duration);
      }
      if (!defined.b) {
        event.b = permutation.b.group(duration);
      }

      event.chord = chord;
      this.incrementTime();
      return;
    }
    event.map = 0;
    this.decrementTime();
  }

  decrementTime() {
    if (--this.time.eventIndex < 0) {
      this.time.eventIndex = this.bars[--this.time.barIndex]?.length - 1;
    }
    return this;
  }

  incrementTime() {
    if (++this.time.eventIndex >= this.bars[this.time.barIndex].length) {
      ++this.time.barIndex;
      this.time.eventIndex = 0;
    }
    return this;
  }

  calculateMaxTime() {
    if (this.time.barIndex > this.maxTime.barIndex) {
      this.maxTime = { ...this.time };
    } else if (this.time.barIndex === this.maxTime.barIndex && this.time.eventIndex >= this.maxTime.eventIndex) {
      this.maxTime.eventIndex = this.time.eventIndex;
    }
    return this;
  }

  configure(config: Config) {
    Object.assign(this.config, config);
    return this;
  }

  string() {
    return `[${this.bars.map(bar => bar.map(event => event.s.string().padEnd(8)).join(' ')).join('|')}]
[${this.bars.map(bar => bar.map(event => event.a.string().padEnd(8)).join(' ')).join('|')}]
[${this.bars.map(bar => bar.map(event => event.t.string().padEnd(8)).join(' ')).join('|')}]
[${this.bars.map(bar => bar.map(event => event.b.string().padEnd(8)).join(' ')).join('|')}]
[${this.bars.map(bar => bar.map(event => event.chord?.string().padEnd(8)).join(' ')).join('|')}]`;
  }
}
