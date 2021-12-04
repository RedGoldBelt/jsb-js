import Note from "./note.js";
import { Printable } from "./util.js";

export default class Group implements Printable {
    private notes: Note[];
    private index: number;

    constructor(notes: Note[], index: number) {
        this.notes = notes;
        this.index = index;
    }

    static parse(string: string) {
        if (string.startsWith("(") && string.endsWith(")")) {
            const array = string.slice(1, -1).split(",").map(string => Note.parse(string));
            return new Group(array, 0);
        }
        return new Group([Note.parse(string)], 0);
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

    getDuration() {
        return this.notes.map(note => note.getDuration()).reduce((l, r) => l + r);
    }

    string() {
        return this.notes.map(note => note.string()).join(" ");
    }
}
