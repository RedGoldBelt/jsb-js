import * as JSB from "../dist/index.js";

const GSTQ = new JSB.Piece("G major", "[G4/ F#/ G A|F#. G/ A|B@ B C|B. A/ G|A G F#|G_.@]").harmonise();
const HTHAS = new JSB.Piece("G major", "[D G G. F#/|G@ B B A@|D D C_|B A B_@]").harmonise();
const M1 = new JSB.Piece("C major", "[C5|A F G C|C B C@ D|E C D B|C_.@]").harmonise();
const M1_SIMPLE = new JSB.Piece("C major", "[C5|A F G C|C B C@ D|E C D B|C_.@]").harmonise({
    dictionary: JSB.DICT.PRIMARY_AB
});
const KMSR = new JSB.Piece("D major", "[A4|F# F# G|A D A|G E5 A4|F#_@ A|D C# B|A. G/ F#|E D C#|D_@]").harmonise();
const C2 = new JSB.Piece("A major", "[C#5|A B C# F#|E C# B_@|D D C# C#|B B A_@]").harmonise();
const H_3 = new JSB.Piece("D major", "[A4_ F# G|F# E D_@|F#_ A A|B_ A_@|A_ B C#|D_ A_@|D. C#/ B C#|B_ A_@|D_ A B|A G F#_@|G. F#/ G A|G F# E_@|A_ D4 G|F#_ E_|D__@]").harmonise();
const H_8 = new JSB.Piece("Ab major", "[Eb4|Ab G F Eb|Ab_ Bb.@ Bb/|Eb C Ab G|F_. Ab|Eb5 C Ab Ab|Bb_ Eb4@ Ab|F Db Eb G|Ab_.@]").harmonise();
const H_10 = new JSB.Piece("Eb major", "[G4_ G F|Eb_ Bb4_|C Bb Bb Ab|G__@|G_ Ab Bb|C_ Bb_|Ab F G Ab|Bb__@|G_ G F|Eb_ Bb4_|Bb Ab Ab G|F__@|F_ G Ab|G F Eb Ab|G_ F_|Eb__@]").harmonise();
const BWV_3_6 = new JSB.Piece("A major", "[A4|A A F# A|B G# F#_@|G# A B E4/ F#/|G# F# E@ B4]").load("[A3|A2 C# D F#|D# E B_@|G# F# E G#/ A/|B B2 E@ E]").harmonise();
const MINOR_TEST = new JSB.Piece("F# minor", "[F#4 F# F# G#|A G# F#_|D F# F# E#|F#__]").harmonise({
    dictionary: JSB.DICT.PRIMARY_A
});

const CHOPIN = new JSB.Piece("Bb major", "[Bb4 Bb/. C// D Bb|G C/ Bb/ A_]").harmonise();