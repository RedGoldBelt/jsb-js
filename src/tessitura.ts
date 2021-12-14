import Pitch from "./pitch.js";

export default class Tessitura {
    private min;
    private max;

    constructor(min: number, max: number) {
        this.min = min;
        this.max = max;
    }

    includes(pitch: Pitch) {
        return pitch.semitones() >= this.getMin() && pitch.semitones() < this.getMax();
    }

    getMin() {
        return this.min;
    }

    setMin(min: number) {
        this.min = min;
        return this;
    }

    getMax() {
        return this.max;
    }

    setMax(max: number) {
        this.max = max;
        return this;
    }
}