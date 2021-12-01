import Chord from "./chord.js";
import Group from "./group.js";
import Note from "./note.js";
import Tone from "./tone.js";

export default class Event {
    previous;
    soprano: Group;
    alto: Group;
    tenor: Group;
    bass: Group;
    duration: number;
    chord: Chord | undefined;
    cadence: boolean;
    map: number = 0;

    constructor(previous: Event | undefined, soprano: Group, alto: Group, tenor: Group, bass: Group) {
        this.previous = previous;
        this.soprano = soprano;
        this.alto = alto;
        this.tenor = tenor;
        this.bass = bass;
        // if ([alto, tenor, bass].filter(group => group.notes.length > 0).some(group => group.duration !== soprano.duration)) {
        //     throw new Error("Groups have differing durations");
        // }
        this.duration = soprano.duration;
        this.cadence = [soprano, alto, tenor, bass].some(group => group.cadence);
    }

    get s() {
        return this.soprano.main;
    }

    set s(tone: Tone) {
        this.soprano = new Group([new Note(false, tone.letter, tone.accidental, tone.octave, this.duration, false, false)], 0);
    }

    get a() {
        return this.alto.main;
    }

    set a(tone: Tone) {
        this.alto = new Group([new Note(false, tone.letter, tone.accidental, tone.octave, this.duration, false, false)], 0);
    }

    get t() {
        return this.tenor.main;
    }

    set t(tone: Tone) {
        this.tenor = new Group([new Note(false, tone.letter, tone.accidental, tone.octave, this.duration, false, false)], 0);
    }

    get b() {
        return this.bass.main;
    }

    set b(tone: Tone) {
        this.bass = new Group([new Note(false, tone.letter, tone.accidental, tone.octave, this.duration, false, false)], 0);
    }
}
