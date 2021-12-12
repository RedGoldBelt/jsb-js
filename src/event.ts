import Chord from "./chord.js";
import Group from "./group.js";
import Resolution from "./resolution.js";
import Util from "./util.js";

export default class Event implements Util.Parts<Group> {
    s;
    a;
    t;
    b;
    private chord: Chord | undefined;
    private type;
    private cache: Util.Parts<boolean>;
    map = 0;

    constructor(s: Group, a: Group, t: Group, b: Group, type: Util.EventType) {
        this.s = s;
        this.a = a;
        this.t = t;
        this.b = b;
        this.type = type;
        this.cache = {
            s: s.main() !== undefined,
            a: a.main() !== undefined,
            t: t.main() !== undefined,
            b: b.main() !== undefined
        };
    }

    static empty(type: Util.EventType) {
        return new Event(Group.empty(), Group.empty(), Group.empty(), Group.empty(), type);
    }

    validate() {
        return Util.PARTS.filter(part => this.getPart(part).main()).map(part => this.getPart(part).duration()).every((duration, i, array) => duration === array[0]);
    }

    fits(resolution: Resolution) {
        for (const part of Util.PARTS) {
            if (this.getCache()[part] && !resolution.includes(this.getPart(part).main().getPitch().getTone())) {
                return false;
            }
        }
        return true;
    }

    clear() {
        for (const part of Util.PARTS) {
            if (!this.getCache()[part]) {
                this.setPart(part, Group.empty());
            }
        }
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

    getType() {
        return this.type;
    }

    setType(type: Util.EventType) {
        this.type = type;
    }

    getCache() {
        return this.cache;
    }

    setCache(cache: Util.Parts<boolean>) {
        this.cache = cache;
    }

    cacheState() {
        this.setCache({
            s: this.s.main() !== undefined,
            a: this.a.main() !== undefined,
            t: this.t.main() !== undefined,
            b: this.b.main() !== undefined
        });
    }
}
