import Chord from "./chord.js";
import Group from "./group.js";
import Note from "./note.js";
import Pitch from "./pitch.js";

export default class Event {
    previous;
    s: Group;
    a: Group;
    t: Group;
    b: Group;
    duration: number;
    chord: Chord | undefined;
    cadence: boolean;
    map: number = 0;

    constructor(previous: Event | undefined, s: Group, a: Group, t: Group, b: Group, cadence: boolean) {
        this.previous = previous;
        this.s = s;
        this.a = a;
        this.t = t;
        this.b = b;
        this.duration = s.duration;
        this.cadence = cadence;
    }
    
    set soprano(pitch: Pitch) {
        this.s = new Group([new Note(pitch, this.duration, false)], 0);
    }

    set alto(pitch: Pitch) {
        this.a = new Group([new Note(pitch, this.duration, false)], 0);
    }

    set tenor(pitch: Pitch) {
        this.t = new Group([new Note(pitch, this.duration, false)], 0);
    }

    set bass(pitch: Pitch) {
        this.b = new Group([new Note(pitch, this.duration, false)], 0);
    }
}
