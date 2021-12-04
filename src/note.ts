import Pitch from "./pitch.js";
import { Printable } from "./util.js";

export default class Note implements Printable{
    private pitch: Pitch;
    private duration: number;
    private tied: boolean;

    constructor(pitch: Pitch, duration: number, tied: boolean) {
        this.pitch = pitch;
        this.duration = duration;
        this.tied = tied;
    }

    static parse(string: string) {
        const result = string.match(/^([A-G](bb|b|#|x|)[1-6])(_*)(\/*)(\.*)(~?)$/);
        if (result === null) {
            throw new Error(`Could not parse note '${string}'`);
        }
        return new Note(
            Pitch.parse(result[1]),
            2 ** (result[3].length - result[4].length) * 1.5 ** result[5].length,
            result[6] === "~"
        );
    }

    getPitch() {
        return this.pitch;
    }

    setPitch(pitch: Pitch) {
        this.pitch = pitch;
        return this;
    }

    getDuration() {
        return this.duration;
    }

    setDuration(duration: number) {
        this.duration = duration;
        return this;
    }

    isTied() {
        return this.tied;
    }

    setTied(tied: boolean) {
        this.tied = tied;
        return this;
    }

    string() {
        return this.getPitch().string();
    }
}
