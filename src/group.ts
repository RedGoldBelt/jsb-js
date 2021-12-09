import Note from "./note.js";
import Util from "./util.js";

export default class Group implements Util.Printable {
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

    static empty() {
        return new Group([], 0);
    }

    main() {
        return this.getNotes()[this.getIndex()];
    }

    at(index: number) {
        if (index < 0) {
            index = this.getNotes().length + index;
        }
        return this.getNotes()[index] as Note;
    }

    duration() {
        return this.getNotes().map(note => note.getDuration()).reduce((l, r) => l + r);
    }

    getNotes() {
        return this.notes;
    }

    setNotes(notes: Note[]) {
        this.notes = notes;
        return this;
    }

    getIndex() {
        return this.index;
    }

    setIndex(index: number) {
        this.index = index;
        return this;
    }

    string() {
        return this.getNotes().map(note => note.string()).join(" ");
    }
}
