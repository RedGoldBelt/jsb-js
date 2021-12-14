import Pitch from "./pitch.js";

export default class Tessitura {
    min;
    max;

    constructor(min: number, max: number) {
        this.min = min;
        this.max = max;
    }

    includes(pitch: Pitch) {
        return pitch.semitones() >= this.min && pitch.semitones() < this.max;
    }
}
