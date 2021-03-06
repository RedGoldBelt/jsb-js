import Chord from './chord.js';
import Group from './group.js';
import Resolution from './resolution.js';
import Parts, { Part } from './parts.js';
import Printable from './printable.js';

export type EventType = 'normal' | 'cadence' | 'end';

export default class Event extends Parts<Group> implements Printable {
  chord: Chord | undefined;
  type;
  map = 0;

  constructor(s: Group, a: Group, t: Group, b: Group, type: EventType) {
    super(s, a, t, b);
    this.type = type;
  }

  static empty(type: EventType = 'normal') {
    return new Event(Group.empty(), Group.empty(), Group.empty(), Group.empty(), type);
  }

  validate() {
    return (['s', 'a', 't', 'b'] as Part[])
      .filter(part => this.get(part).main())
      .map(part => this.get(part).duration())
      .every((duration, i, array) => duration === array[0]);
  }

  fits(resolution: Resolution) {
    if (this.s.main() && !resolution.includes(this.s.main().pitch.tone)) {
      return false;
    }
    if (this.a.main() && !resolution.includes(this.a.main().pitch.tone)) {
      return false;
    }
    if (this.t.main() && !resolution.includes(this.t.main().pitch.tone)) {
      return false;
    }
    if (this.b.main() && !resolution.includes(this.b.main().pitch.tone)) {
      return false;
    }
    return true;
  }

  duration() {
    return Math.max(this.s.duration(), this.a.duration(), this.t.duration(), this.b.duration()) || 1;
  }

  string() {
    return `{${this.s.string()}} {${this.a.string()}} {${this.t.string()}} {${this.b.string()}}`;
  }
}
