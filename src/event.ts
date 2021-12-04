import Chord from "./chord.js";
import Group from "./group.js";

export default class Event {
    private previous;
    private s: Group;
    private a: Group;
    private t: Group;
    private b: Group;
    private chord: Chord | undefined;
    private cadence: boolean;
    map: number = 0;

    constructor(previous: Event | undefined, s: Group, a: Group, t: Group, b: Group, cadence: boolean) {
        this.previous = previous;
        this.s = s;
        this.a = a;
        this.t = t;
        this.b = b;
        this.cadence = cadence;
    }

    getPrevious() {
        return this.previous;
    }

    setPrevious(previous: Event) {
        this.previous = previous;
        return this;
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

    duration() {
        return this.getS().duration() ?? this.getA().duration ?? this.getT().duration ?? this.getB().duration ?? 0;
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
