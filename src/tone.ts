export default class Tone {
    static ACC = ["", "#", "x"];
    private static LETTER = ["C", "D", "E", "F", "G", "A", "B"];
    private static PITCH = [0, 2, 4, 5, 7, 9, 11];

    letter;
    acc;

    constructor(letter: number, acc: number) { this.letter = letter; this.acc = acc; }

    static parse(string: string) {
        const result = string.match(/([A-G])(bb|x|b|#|)/);
        return new Tone(Tone.LETTER.indexOf(result[1]), Tone.ACC.indexOf(result[2]));
    }

    pitch() { return Tone.PITCH[this.letter] + this.acc; }

    eq(tone: Tone) { return tone ? this.letter === tone.letter && this.acc === tone.acc : false; }

    alter(acc: number) { this.acc += acc; return this; }

    string() { return Tone.LETTER[this.letter] + Tone.ACC[this.acc]; }
}

Tone.ACC[-2] = "bb";
Tone.ACC[-1] = "b";
