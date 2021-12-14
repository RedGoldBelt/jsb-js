import Util from "./util";

export default class Parts<T> {
    s: T;
    a: T;
    t: T;
    b: T;

    constructor(s: T, a: T, t: T, b: T) {
        this.s = s;
        this.a = a;
        this.t = t;
        this.b = b;
    }

    get(part: Util.Part) {
        switch (part) {
            case "s": return this.s;
            case "a": return this.a;
            case "t": return this.t;
            case "b": return this.b;
        }
    }

    set(part: Util.Part, value: T) {
        switch (part) {
            case "s": return this.s = value;
            case "a": return this.a = value;
            case "t": return this.t = value;
            case "b": return this.b = value;
        }
    }
}
