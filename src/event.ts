import Chord from "./chord.js";
import Group from "./group.js";

export default class Event {
    previous;
    private s: Group;
    private a: Group;
    private t: Group;
    private b: Group;
    private duration: number;
    private chord: Chord | undefined;
    private cadence: boolean;
    map: number = 0;

    constructor(previous: Event | undefined, s: Group, a: Group, t: Group, b: Group, cadence: boolean) {
        this.previous = previous;
        this.s = s;
        this.a = a;
        this.t = t;
        this.b = b;
        this.duration = s.getDuration();
        this.cadence = cadence;
    }

    getS() {
        return this.s;
    }

    setS(s: Group) {
        this.s = s;
        return this;
    }

    getA() {
        return this.a;
    }

    setA(a: Group) {
        this.a = a;
        return this;
    }

    getT() {
        return this.t;
    }

    setT(t: Group) {
        this.t = t;
        return this;
    }

    getB() {
        return this.b;
    }

    setB(b: Group) {
        this.b = b;
        return this;
    }

    getDuration() {
        return this.duration;
    }

    getChord() {
        return this.chord;
    }

    setChord(chord: Chord | undefined) {
        this.chord = chord;
        return this;
    }

    isCadence() {
        return this.cadence;
    }
}
