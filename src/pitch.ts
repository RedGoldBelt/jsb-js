import Group from "./group.js";
import Note from "./note.js";
import Tone from "./tone.js";
import Util from "./util.js";

export default class Pitch implements Util.Printable {
    private tone: Tone;
    private octave;

    constructor(tone: Tone, octave: number) {
        this.tone = tone;
        this.octave = octave;
    }

    static parse(string: string) {
        const result = string.match(/^([A-G](bb|b|#|x|))([1-6])$/);
        if (result === null) {
            throw `Could not parse pitch '${string}'`;
        }
        return new Pitch(Tone.parse(result[1]), Number(result[3]));
    }

    semitones() {
        return this.getTone().semitones() + 12 * this.getOctave();
    }

    near(tone: Tone) {
        const tone1 = new Pitch(tone, this.getOctave() - 1);
        const tone2 = new Pitch(tone, this.getOctave());
        const tone3 = new Pitch(tone, this.getOctave() + 1);
        return [tone1, tone2, tone3].sort((l, r) => Math.abs(this.semitones() - l.semitones()) - Math.abs(this.semitones() - r.semitones()));
    }

    getTone() {
        return this.tone;
    }

    setTone(tone: Tone) {
        this.tone = tone;
        return this;
    }

    getOctave() {
        return this.octave;
    }

    setOctave(octave: number) {
        this.octave = octave;
        return this;
    }

    string() {
        return this.getTone().string() + this.getOctave();
    }

    group(duration: number) {
        return new Group([new Note(this, duration)], 0);
    }
}
