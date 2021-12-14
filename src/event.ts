import Chord from "./chord.js";
import Group from "./group.js";
import Resolution from "./resolution.js";
import Parts from "./parts.js";
import Util from "./util.js";
import Printable from "./printable.js";

export default class Event extends Parts<Group> implements Printable {
    private chord: Chord | undefined;
    private type;
    map = 0;

    constructor(s: Group, a: Group, t: Group, b: Group, type: Util.EventType) {
        super(s, a, t, b);
        this.type = type;
    }

    static empty(type: Util.EventType) {
        return new Event(Group.empty(), Group.empty(), Group.empty(), Group.empty(), type);
    }

    validate() {
        return Util.PARTS.filter(part => this.get(part).main()).map(part => this.get(part).duration()).every((duration, i, array) => duration === array[0]);
    }

    fits(resolution: Resolution) {
        for (const part of Util.PARTS) {
            if (this.get(part).main() && !resolution.includes(this.get(part).main().getPitch().getTone())) {
                return false;
            }
        }
        return true;
    }

    duration() {
        return this.getS().duration() ?? this.getA().duration ?? this.getT().duration ?? this.getB().duration ?? 1;
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

    string() {
        return `{${this.getS().string()}} {${this.getA().string()}} {${this.getT().string()}} {${this.getB().string()}}`;
    }
}
