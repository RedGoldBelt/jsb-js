import Util from "./util";

export default class Inversions<T> {
    private root;
    private third;
    private fifth;
    private seventh;

    constructor(root: T, third: T, fifth: T, seventh: T | undefined) {
        this.root = root;
        this.third = third;
        this.fifth = fifth;
        this.seventh = seventh;
    }

    getRoot() {
        return this.root;
    }

    setRoot(root: T) {
        this.root = root;
        return this;
    }

    getThird() {
        return this.third;
    }

    setThird(third: T) {
        this.third = third;
        return this;
    }

    getFifth() {
        return this.fifth;
    }

    setFifth(fifth: T) {
        this.fifth = fifth;
        return this;
    }

    getSeventh() {
        return this.seventh;
    }

    setSeventh(seventh: T) {
        this.seventh = seventh;
        return this;
    }

    get(inversion: Util.Inversion) {
        switch (inversion) {
            case 0: return this.getRoot();
            case 1: return this.getThird();
            case 2: return this.getFifth();
            case 3: return this.getFifth() as T;
        }
    }

    set(inversion: Util.Inversion, value: T) {
        switch (inversion) {
            case 0: return this.setRoot(value);
            case 1: return this.setThird(value);
            case 2: return this.setFifth(value);
            case 3: return this.setFifth(value);
        }
    }
}