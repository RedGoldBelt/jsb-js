import Chord from "./chord.js";
import Group from "./group.js";
import Util from "./util.js";

export default class Event {
    private s: Group;
    private a: Group;
    private t: Group;
    private b: Group;
    private chord: Chord | undefined;
    private cadence: boolean;
    map: number = 0;

    constructor(s: Group, a: Group, t: Group, b: Group, cadence: boolean) {
        this.s = s;
        this.a = a;
        this.t = t;
        this.b = b;
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

    getPart(part: Util.Part) {
        switch (part) {
            case "s": return this.getS();
            case "a": return this.getA();
            case "t": return this.getT();
            case "b": return this.getB();
        }
    }

    setPart(part: Util.Part, group: Group) {
        switch (part) {
            case "s": return this.setS(group);
            case "a": return this.setA(group);
            case "t": return this.setT(group);
            case "b": return this.setB(group);
        }
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
