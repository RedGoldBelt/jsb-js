import Pitch from "./pitch.js";
import Printable from "./printable.js";

export default class Note implements Printable{
    pitch: Pitch;
    duration: number;

    constructor(pitch: Pitch, duration: number) {
        this.pitch = pitch;
        this.duration = duration;
    }

    static parse(string: string) {
        const result = string.match(/^([A-G](bb|b|#|x|)[1-6])(_*)(\/*)(\.*)$/);
        if (result === null) {
            throw `Could not parse note '${string}',`;
        }
        return new Note(
            Pitch.parse(result[1]),
            2 ** (result[3].length - result[4].length) * 1.5 ** result[5].length
        );
    }

    semitones() {
        return this.pitch.semitones();
    }

    string() {
        let string = this.pitch.string();
        switch (this.duration) {
            case 0.25: string += "𝅘𝅥𝅯"; break;
            case 0.5: string += "♪"; break;
            case 0.75: string += "♪."; break;
            case 1: string += "♩"; break;
            case 1.5: string += "♩."; break;
            case 2: string += "𝅗𝅥"; break;
            case 3: string += "𝅗𝅥."; break;
            case 4: string += "𝅝"; break;
            case 6: string += "𝅝."; break;
        }
        return string;
    }
}
