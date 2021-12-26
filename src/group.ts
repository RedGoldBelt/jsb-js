import Note from './note.js';
import Printable from './printable.js';

export default class Group implements Printable {
  notes: Note[];
  index: number;

  constructor(notes: Note[], index: number) {
    this.notes = notes;
    this.index = index;
  }

  static parse(string: string) {
    if (string.startsWith('(') && string.endsWith(')')) {
      const array = string
        .slice(1, -1)
        .split(',')
        .map(string => Note.parse(string));
      return new Group(array, 0);
    }
    return new Group([Note.parse(string)], 0);
  }

  static empty() {
    return new Group([], 0);
  }

  main() {
    return this.notes[this.index];
  }

  at(index: number) {
    if (index < 0) {
      index = this.notes.length + index;
    }
    return this.notes[index] as Note;
  }

  duration() {
    return this.notes.map(note => note.duration).reduce((l, r) => l + r, 0);
  }

  string() {
    return this.notes.map(note => note.string()).join(' ');
  }
}
