import Tone from "./tone.js";
import { Inversion, Printable } from "./util.js";

export default class Resolution implements Printable {
    private root;
    private third;
    private fifth;
    private seventh;
    private inversion: Inversion;

    constructor(root: Tone, third: Tone, fifth: Tone, seventh: Tone | undefined, inversion: Inversion) {
        this.root = root;
        this.third = third;
        this.fifth = fifth;
        this.seventh = seventh;
        this.inversion = inversion;
    }

    at(inversion: Inversion) {
        switch (inversion) {
            case 0: return this.root;
            case 1: return this.third;
            case 2: return this.fifth;
            case 3: return this.seventh as Tone;
        }
    }

    bass() {
        return this.at(this.inversion);
    }

    excludes(testTone: Tone | undefined) {
        if (testTone === undefined) {
            return false;
        }
        return !this.root?.equals(testTone) && !this.third?.equals(testTone) && !this.fifth?.equals(testTone) && !this.seventh?.equals(testTone);
    }

    getRoot() {
        return this.root;
    }

    setRoot(root: Tone) {
        this.root = root;
        return this;
    }

    getThird() {
        return this.third;
    }

    setThird(third: Tone) {
        this.third = third;
        return this;
    }
    getFifth() {
        return this.fifth;
    }

    setFifth(fifth: Tone) {
        this.fifth = fifth;
        return this;
    }
    getSeventh() {
        return this.seventh;
    }

    setSeventh(seventh: Tone) {
        this.seventh = seventh;
        return this;
    }

    string() {
        const array = [this.root, this.third, this.fifth, this.seventh].filter(tone => tone).map(tone => tone?.string());
        array[this.inversion] = `{${array[this.inversion]}}`;
        return array.join(" ");
    }
}
