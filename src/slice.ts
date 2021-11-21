import Chord from "./chord.js";
import Note from "./note";

export default class Slice {
    s: Note;
    a: Note;
    t: Note;
    b: Note;
    d: number;
    c: Chord;
    map: number = 0;

    constructor(d: number) {
        this.d = d;
    }
}
