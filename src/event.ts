import Chord from "./chord.js";
import Note from "./note";

export default class Event {
    previous;
    s: Note | undefined;
    a: Note | undefined;
    t: Note | undefined;
    b: Note | undefined;
    duration: number;
    chord: Chord | undefined;
    map: number = 0;
    cadence: boolean;

    constructor(previous: Event | undefined, duration: number, cadence: boolean) {
        this.previous = previous;
        this.duration = duration;
        this.cadence = cadence;
    }
}
