import Chord from "./chord.js";
import Group from "./group.js";
import Note from "./note.js";
import Tone from "./tone.js";

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

    constructor(previous: Event | undefined, s: Group, a: Group, t: Group, b: Group) {
        this.previous = previous;
        this.s = s;
        this.a = a;
        this.t = t;
        this.b = b;
        this.duration = s.duration;
        this.cadence = [s, a, t, b].some(group => group.cadence);
    }
    
    set soprano(tone: Tone) {
        this.s = new Group([new Note(false, tone.letter, tone.accidental, tone.octave, this.duration, false, false)], 0);
    }

    set alto(tone: Tone) {
        this.a = new Group([new Note(false, tone.letter, tone.accidental, tone.octave, this.duration, false, false)], 0);
    }

    set tenor(tone: Tone) {
        this.t = new Group([new Note(false, tone.letter, tone.accidental, tone.octave, this.duration, false, false)], 0);
    }

    set bass(tone: Tone) {
        this.b = new Group([new Note(false, tone.letter, tone.accidental, tone.octave, this.duration, false, false)], 0);
    }
}
