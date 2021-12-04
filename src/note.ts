import Pitch from "./pitch.js";
import { Printable } from "./util.js";

export default class Note implements Printable{
    pitch: Pitch;
    private duration: number;
    private tie: boolean;

    constructor(pitch: Pitch, duration: number, tie: boolean) {
        this.pitch = pitch;
        this.duration = duration;
        this.tie = tie;
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

    getDuration() {
        return this.duration;
    }

    string() {
        return this.pitch.string();
    }
}
