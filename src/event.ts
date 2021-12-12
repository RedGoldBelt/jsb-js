import Chord from "./chord.js";
import Group from "./group.js";
import Resolution from "./resolution.js";
import Parts from "./parts.js";
import Util from "./util.js";

export default class Event extends Parts<Group> implements Util.Printable {
    private chord: Chord | undefined;
    private type;
    private cache: Util.Cache;
    map = 0;

    constructor(s: Group, a: Group, t: Group, b: Group, type: Util.EventType) {
        super(s, a, t, b);
        this.type = type;
        this.cache = new Parts<boolean>(s.main() !== undefined, a.main() !== undefined, t.main() !== undefined, b.main() !== undefined);
    }

    static empty(type: Util.EventType) {
        return new Event(Group.empty(), Group.empty(), Group.empty(), Group.empty(), type);
    }

    validate() {
        return Util.PARTS.filter(part => this.get(part).main()).map(part => this.get(part).duration()).every((duration, i, array) => duration === array[0]);
    }

    fits(resolution: Resolution) {
        for (const part of Util.PARTS) {
            if (this.getCache().get(part) && !resolution.includes(this.get(part).main().getPitch().getTone())) {
                return false;
            }
        }
        return true;
    }

    clear() {
        for (const part of Util.PARTS) {
            if (!this.getCache().get(part)) {
                this.set(part, Group.empty());
            }
        }
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

    getType() {
        return this.type;
    }

    setType(type: Util.EventType) {
        this.type = type;
    }

    getCache() {
        return this.cache;
    }

    setCache(cache: Util.Cache) {
        this.cache = cache;
    }

    cacheState() {
        this.setCache(new Util.Cache(
            this.getS().main() !== undefined,
            this.getA().main() !== undefined,
            this.getT().main() !== undefined,
            this.getB().main() !== undefined
        ));
    }

    string() {
        return `{${this.getS().string()}} {${this.getA().string()}} {${this.getT().string()}} {${this.getB().string()}}`;
    }
}
