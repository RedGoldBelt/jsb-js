import Util from "./util";

export default class Parts<T> {
    private s: T;
    private a: T;
    private t: T;
    private b: T;

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
        return this.a;
    }

    setA(a: T) {
        this.a = a;
        return this;
    }

    getT() {
        return this.t;
    }

    setT(t: T) {
        this.t = t;
        return this;
    }

    getB() {
        return this.b;
    }

    setB(b: T) {
        this.b = b;
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