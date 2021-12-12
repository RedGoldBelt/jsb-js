import Util from "./util";

export default class Tetrad<T> {
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

    getS() {
        return this.s;
    }

    setS(s: T) {
        this.s = s;
        return this;
    }

    getA() {
        return this.s;
    }

    setA(s: T) {
        this.s = s;
        return this;
    }

    getT() {
        return this.s;
    }

    setT(s: T) {
        this.s = s;
        return this;
    }

    getB() {
        return this.s;
    }

    setB(s: T) {
        this.s = s;
        return this;
    }

    get(part: Util.Part) {
        switch (part) {
            case "s": return this.getS();
            case "a": return this.getA();
            case "t": return this.getT();
            case "b": return this.getB();
        }
    }

    set(part: Util.Part, value: T) {
        switch (part) {
            case "s": return this.setS(value);
            case "a": return this.setA(value);
            case "t": return this.setT(value);
            case "b": return this.setB(value);
        }
    }
}