declare module "event" {
    import Chord from "chord";
    import Group from "group";
    import Util from "util";
    export default class Event {
        private s;
        private a;
        private t;
        private b;
        private chord;
        private cadence;
        map: number;
        constructor(s: Group, a: Group, t: Group, b: Group, cadence: boolean);
        getS(): Group;
        setS(s: Group): this;
        getA(): Group;
        setA(a: Group): this;
        getT(): Group;
        setT(t: Group): this;
        getB(): Group;
        setB(b: Group): this;
        getPart(part: Util.Part): Group;
        setPart(part: Util.Part, group: Group): this;
        duration(): number;
        getChord(): Chord | undefined;
        setChord(chord: Chord | undefined): this;
        isCadence(): boolean;
    }
}
declare module "util" {
    import Event from "event";
    import Pitch from "pitch";
    namespace Util {
        type Alteration = "" | "7" | "o7";
        type Bar = Event[];
        interface Dictionary {
            COMMON: {
                MAJOR: any;
                MINOR: any;
            };
            SPECIFIC?: {
                I: any;
                II: any;
                III: any;
                IV: any;
                V: any;
                VI: any;
                VII: any;
                i: any;
                ii: any;
                iii: any;
                iv: any;
                v: any;
                vi: any;
                vii: any;
            };
        }
        type Inversion = 0 | 1 | 2 | 3;
        type Part = "s" | "a" | "t" | "b";
        interface Permutation {
            a: Pitch;
            t: Pitch;
            score: number;
        }
        abstract class Printable {
            abstract string(): string;
        }
        interface Time {
            bar: number;
            event: number;
        }
    }
    export default Util;
}
declare module "note" {
    import Pitch from "pitch";
    import Util from "util";
    export default class Note implements Util.Printable {
        private pitch;
        private duration;
        constructor(pitch: Pitch, duration: number);
        static parse(string: string): Note;
        getPitch(): Pitch;
        setPitch(pitch: Pitch): this;
        getDuration(): number;
        setDuration(duration: number): this;
        string(): string;
    }
}
declare module "group" {
    import Note from "note";
    import Util from "util";
    export default class Group implements Util.Printable {
        private notes;
        private index;
        constructor(notes: Note[], index: number);
        static parse(string: string): Group;
        static empty(): Group;
        main(): Note;
        at(index: number): Note;
        duration(): number;
        getNotes(): Note[];
        setNotes(notes: Note[]): this;
        getIndex(): number;
        setIndex(index: number): this;
        string(): string;
    }
}
declare module "pitch" {
    import Group from "group";
    import Tone from "tone";
    import Util from "util";
    export default class Pitch implements Util.Printable {
        private tone;
        private octave;
        constructor(tone: Tone, octave: number);
        static parse(string: string): Pitch;
        semitones(): number;
        near(tone: Tone): Pitch[];
        getTone(): Tone;
        setTone(tone: Tone): this;
        getOctave(): number;
        setOctave(octave: number): this;
        string(): string;
        group(duration: number): Group;
    }
}
declare module "tone" {
    import Pitch from "pitch";
    import Util from "util";
    export default class Tone implements Util.Printable {
        static ACCIDENTALS: string[];
        static LETTERS: string[];
        private static PITCHES;
        private letter;
        private accidental;
        constructor(letter: number, accidental: number);
        static parse(string: string): Tone;
        semitones(): number;
        equals(tone: Tone | undefined): boolean;
        near(pitch: Pitch): Pitch[];
        getLetter(): number;
        setLetter(letter: number): this;
        getAccidental(): number;
        setAccidental(accidental: number): this;
        alterAccidental(accidental: number): this;
        string(): string;
    }
}
declare module "key" {
    import Tone from "tone";
    import Util from "util";
    export default class Key implements Util.Printable {
        private tone;
        private tonality;
        constructor(tone: Tone, tonality: boolean);
        static parse(string: string): Key;
        degree(degree: number, relativePitch?: number): Tone;
        accidentals(): number;
        signature(): number[];
        getTone(): Tone;
        setTone(tone: Tone): this;
        getTonality(): boolean;
        setTonality(tonality: boolean): this;
        string(): string;
    }
}
declare module "numeral" {
    import Util from "util";
    export default class Numeral implements Util.Printable {
        static NUMERALS: string[];
        private accidental;
        private degree;
        private tonality;
        constructor(accidental: number, degree: number, tonality: boolean);
        static parse(string: string): Numeral;
        getAccidental(): number;
        setAccidental(accidental: number): this;
        getDegree(): number;
        setDegree(degree: number): this;
        getTonality(): boolean;
        setTonality(tonality: boolean): this;
        string(): string;
    }
}
declare module "resolution" {
    import Tone from "tone";
    import Util from "util";
    export default class Resolution implements Util.Printable {
        private root;
        private third;
        private fifth;
        private seventh;
        private inversion;
        constructor(root: Tone, third: Tone, fifth: Tone, seventh: Tone | undefined, inversion: Util.Inversion);
        at(inversion: Util.Inversion): Tone;
        bass(): Tone;
        excludes(testTone: Tone | undefined): boolean;
        getRoot(): Tone;
        setRoot(root: Tone): this;
        getThird(): Tone;
        setThird(third: Tone): this;
        getFifth(): Tone;
        setFifth(fifth: Tone): this;
        getSeventh(): Tone | undefined;
        setSeventh(seventh: Tone): this;
        string(): string;
    }
}
declare module "chord" {
    import Key from "key";
    import Numeral from "numeral";
    import Resolution from "resolution";
    import Util from "util";
    export default class Chord implements Util.Printable {
        private static INVERSIONS;
        private base;
        private alteration;
        private inversion;
        private relativeKey;
        constructor(base: Numeral | null, alteration: Util.Alteration, inversion: Util.Inversion, relativeKey: Numeral);
        static parse(string: string): Chord;
        resolve(key: Key): Resolution;
        progression(dictionary: Util.Dictionary): Chord[];
        getInversion(): Util.Inversion;
        setInversion(inversion: Util.Inversion): this;
        toStringStem(): string;
        string(): string;
    }
}
declare module "dictionary" {
    import Util from "util";
    namespace Dict {
        const FULL: Util.Dictionary;
        const PRIMARY_A: Util.Dictionary;
        const PRIMARY_AB: Util.Dictionary;
        const PRIMARY_ABC: Util.Dictionary;
    }
    export default Dict;
}
declare module "piece" {
    import Key from "key";
    import Util from "util";
    export default class Piece implements Util.Printable {
        private input;
        private output;
        private time;
        private maxTime;
        private key;
        private dictionary;
        parse(string: string, part: Util.Part): this;
        private previousPreviousOutputEvent;
        private previousOutputEvent;
        private outputEvent;
        harmonise(): this;
        private step;
        private score;
        private checkParallel;
        getInput(): Util.Bar[];
        setInput(input: Util.Bar[]): this;
        getOutput(): Util.Bar[];
        setOutput(output: Util.Bar[]): this;
        getTime(): Util.Time;
        setTime(time: Util.Time): this;
        getMaxTime(): Util.Time;
        setMaxTime(maxTime: Util.Time): this;
        getKey(): Key;
        setKey(key: Key): this;
        getDictionary(): Util.Dictionary;
        setDictionary(dictionary: Util.Dictionary): this;
        string(): string;
    }
}
declare module "index" {
    import Chord from "chord";
    import Dict from "dictionary";
    import Event from "event";
    import Group from "group";
    import Key from "key";
    import Note from "note";
    import Numeral from "numeral";
    import Piece from "piece";
    import Pitch from "pitch";
    import Resolution from "resolution";
    import Tone from "tone";
    import Util from "util";
    export { Tone, Chord, Dict, Event, Group, Key, Note, Numeral, Piece, Resolution, Pitch, Util };
}
