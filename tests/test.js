import {
  Dict,
  Key,
  Piece
} from "../dist/index.js";

console.time("Parsing");

const GOD_SAVE_THE_QUEEN = new Piece().setKey(Key.parse("G major")).parse("[G4 G4 A4|F#4. G4/ A4;|B4 B4 C5|B4. A4/ G4|A4 G4 F#4|G4_.;]", "s");
const HARK_THE_HERALD_ANGELS_SING = new Piece().setKey(Key.parse("G major")).parse("[D4 G4 G4. F#4/|G4; B4 B4 A4;|D5 D5 (C5.,C5/)|B4 A4 B4_;]", "s");
const EXERCISE_V1 = new Piece().setKey(Key.parse("C major")).parse("[C5|A4 F4 G4 C5|C5 B4 C5; D5|E5 C5 D5 B4|C5_.;]", "s");
const EXERCISE_V2 = new Piece().setKey(Key.parse("C major")).parse("[C5|A4 F4 G4 C5|C5 B4 C5; D5|E5 C5 D5 B4|C5_.;]", "s").configure("dictionary", Dict.PRIMARY_AB);
const KMSR_EXERCISE = new Piece().setKey(Key.parse("D major")).parse("[A4|F#4 F#4 G4|A4 D5 A4|G4 E5 A4|F#4_; A4|D5 C#5 B4|A4. G4/ F#4|E4 D4 C#4|D4_;]", "s");
const COURSEWORK_2 = new Piece().setKey(Key.parse("A major")).parse("[C#5|A4 B4 C#5 F#5|(E5/,D5/) C#5 B4_;|D5 D5 (C#5/,B4/) C#5|B4 B4 A4_;]", "s");
const CHORALE_1 = new Piece().setKey(Key.parse("D major")).parse("[A4_ F#4 G4|F#4 E4 D4_;|F#4_ A4 A4|B4_ A4_;|A4_ B4 C#5|D5_ A4_;|D5. C#5/ B4 C#5|B4_ A4_;|D5_ A4 B4|A4 G4 F#4_;|G4. F#4/ G4 A4|G4 F#4 E4_;|A4_ D4 G4|F#4_ E4_|D4__;]", "s");
const CHORALE_2 = new Piece().setKey(Key.parse("Ab major")).parse("[Eb4|Ab4 G4 F4 Eb4|(Ab4,Ab4) (Bb4,C5/,Db5/)|Eb5 C5 Ab4 G4|F4. Ab4|Eb5 C5 Ab4 Ab4|Bb4_ Eb4; Ab4|F4 Db4 Eb4 G4|Ab4_.;]", "s");
const CHORALE_3 = new Piece().setKey(Key.parse("Eb major")).parse("[G4_ G4 F4|Eb4_ Bb4_|C5 Bb4 Bb4 Ab4|G4__;|G4_ Ab4 Bb4|C5_ Bb4_|Ab4 F4 G4 Ab4|Bb4__;|G4_ G4 F4|Eb4_ Bb4_|Bb4 Ab4 Ab4 G4|F4__;|F4_ G4 Ab4|G4 F4 Eb4 Ab4|G4_ F4_|Eb4__;]", "s");
const PRIMARY_AB_TEST = new Piece().setKey(Key.parse("F# minor")).parse("[F#4 F#4 F#4 G#4|A4 G#4 F#4_|D4 F#4 F#4 E#4|F#4__]", "s").configure("dictionary", Dict.PRIMARY_AB);
const CHOPIN = new Piece().setKey(Key.parse("Bb major")).parse("[Bb4 Bb4/. C5// D5 Bb4|G4 C5/ Bb4/ A4_]", "s");
const BWV_1_6 = new Piece().setKey(Key.parse("F major")).parse("[F4|C5 A4 F4 C5|D5_ C5; C5|D5 E5 F5/ F5/ E5|D5 D5 C5; A4|D5 C5 Bb4 A4|G4_ F4_; C5_ A4_;|C5_ A4_;|A4 A4 G4 G4|A4 A4 G4; A4|Bb4 A4 G4 G4|F4_; F5 E5|D5 C5 Bb4 A4/ A4/|G4 G4 F4:]", "s");
const BWV_X_6_SB = new Piece().setKey(Key.parse("A major")).parse("[A4|A4 A4 (F#4/,G#4/) A4|(B4/,A4/) G#4 F#4_;|G#4 A4 B4 E4/ F#4/|(G#4/,A4/) F#4 E4;]", "s").parse("[A3|A2 C#3 D3 F#3|D#3 E3 B2_;|G#2 F#2 E2 G#2/ A2/|B2 B2 E3;]", "b");

console.timeEnd("Parsing");

console.time("Harmonisation");

GOD_SAVE_THE_QUEEN.harmonise();
HARK_THE_HERALD_ANGELS_SING.harmonise();
EXERCISE_V1.harmonise();
EXERCISE_V2.harmonise();
KMSR_EXERCISE.harmonise();
COURSEWORK_2.harmonise();
CHORALE_1.harmonise();
CHORALE_2.harmonise();
CHORALE_3.harmonise();
PRIMARY_AB_TEST.harmonise();
CHOPIN.harmonise();
BWV_1_6.harmonise();
BWV_X_6_SB.harmonise();

console.timeEnd("Harmonisation");
