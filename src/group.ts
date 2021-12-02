import Note from "./note.js";

export default class Group {
    private notes: Note[];
    private index: number;

    constructor(notes: Note[], index: number) {
        this.notes = notes;
        this.index = index;
    }

    static parse(string: string) {
        if (string.startsWith("(") && string.endsWith(")")) {
            const array = string.slice(1, -1).split(",").map(string => Note.parse(string));
            const index = array.findIndex(note => note.harmonic);
            return new Group(array, index === -1 ? 0 : index);
        }
        return new Group([Note.parse(string)], 0);
    }

    get main() {
        return this.notes[this.index];
    }

    at(index: number) {
        if (index < 0) {
            index = this.notes.length + index;
        }
        return this.notes[index] as Note;
    }

    get duration() {
        return this.notes.map(note => note.duration).reduce((l, r) => l + r);
    }

    get cadence() {
        return this.notes.some(note => note.cadence);
    }

    get string() {
        return this.notes.map(note => note.string).join(" ");
    }
}
