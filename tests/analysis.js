import fs from "fs";
import {
    Chord,
    Key,
    Numeral
} from "../dist/index.js";

const p = {
    init(string) {
        this.key = Key.parse(string);
        this.chord = new Chord(undefined, 0, 0, new Numeral(0, 0, this.key.getTonality()));
    },

    register(string) {
        this.previous = this.chord;
        this.chord = Chord.parse(string);
        if (this.chord.getRelativeKey().string() === this.previous.getRelativeKey().string()) {
            const buffer = this.previous.getRelativeKey().getTonality() ? this.DICT.COMMON.MAJOR : this.DICT.COMMON.MINOR;
            const previous = this.previous.stringStem();
            if (buffer[previous] === undefined) {
                buffer[previous] = [];
            }
            const progression = this.chord.stringStem();
            if (!buffer[previous].includes(progression)) {
                buffer[previous].push(progression);
            }
        } else {
            const relativeKey = this.previous.getRelativeKey().string();
            const buffer = this.DICT.SPECIFIC[relativeKey];
            if (buffer === undefined) {
                buffer = [];
            }
            const previous = this.previous.stringStem();
            if (buffer[previous] === undefined) {
                buffer[previous] = [];
            }
            const progression = this.chord.string();
            if (!buffer[previous].includes(progression)) {
                buffer[previous].push(progression);
            }
        }
    },

    load(key, chords) {
        this.init(key);
        chords.split(" ").forEach(chord => this.register(chord));
    },

    DICT: {
        COMMON: {
            MAJOR: {},
            MINOR: {}
        },
        SPECIFIC: {}
    }
}

// BWV 1.6
p.load("F major", "I Vb I vi Ib IV I");

fs.writeFile("./tests/data/output.json", JSON.stringify(p.DICT), e => 0);