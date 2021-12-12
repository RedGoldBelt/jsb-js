import Event from "./event.js";
import Pitch from "./pitch.js";
import Parts from "./parts.js";

export default class Permutation extends Parts<Pitch> {
    private score = 0;

    calculateScore(previousEvent: Event | undefined) {
        const s = this.getS().semitones();
        const a = this.getA().semitones();
        const t = this.getT().semitones();
        const b = this.getB().semitones();
        const previousA = previousEvent?.getA().at(-1).getPitch() ?? Pitch.parse("D4");
        const previousT = previousEvent?.getT().at(-1).getPitch() ?? Pitch.parse("B3");
        const aChange = Math.abs(a - previousA.semitones());
        const tChange = Math.abs(t - previousT.semitones());

        if (
            aChange > 7 ||
            tChange > 7 ||
            a > s ||
            t > a ||
            b > t ||
            a > 64 ||
            a < 43 ||
            t < 40 ||
            t > 52
        ) {
            return Infinity;
        }
        const sa = s - a;
        const at = a - t;
        const stdDev = Math.sqrt((sa * sa + at * at) / 2 - (sa + at) ** 2 / 4);
        const score = aChange + tChange + stdDev;
        return score;
    }

    getScore() {
        return this.score;
    }
}