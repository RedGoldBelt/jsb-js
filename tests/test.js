import * as JSB from "../dist/index.js";

new JSB.Piece("G major").parse("[(G4/,F#/) G A|F#. G/ A|B@ B C|B. A/ G|A G F#|G_.@]", "s").harmonise();
new JSB.Piece("G major").parse("[D G G. F#/|G@ B B A@|D D C_|B A B_@]", "s").harmonise();
new JSB.Piece("C major").parse("[C5|A F G C|C B C@ D|E C D B|C_.@]", "s").harmonise();
new JSB.Piece("C major", "[C5|A F G C|C B C@ D|E C D B|C_.@]", "s").harmonise({
    dictionary: JSB.Dict.PRIMARY_AB
});
new JSB.Piece("D major").parse("[A4|F# F# G|A D A|G E5 A4|F#_@ A|D C# B|A. G/ F#|E D C#|D_@]", "s").harmonise();
new JSB.Piece("A major").parse("[C#5|A B C# F#|E C# B_@|D D C# C#|B B A_@]", "s").harmonise();
new JSB.Piece("D major").parse("[A4_ F# G|F# E D_@|F#_ A A|B_ A_@|A_ B C#|D_ A_@|D. C#/ B C#|B_ A_@|D_ A B|A G F#_@|G. F#/ G A|G F# E_@|A_ D4 G|F#_ E_|D__@]", "s").harmonise();
new JSB.Piece("Ab major").parse("[Eb4|Ab G F Eb|Ab_ Bb.@ Bb/|Eb C Ab G|F_. Ab|Eb5 C Ab Ab|Bb_ Eb4@ Ab|F Db Eb G|Ab_.@]", "s").harmonise();
new JSB.Piece("Eb major").parse("[G4_ G F|Eb_ Bb4_|C Bb Bb Ab|G__@|G_ Ab Bb|C_ Bb_|Ab F G Ab|Bb__@|G_ G F|Eb_ Bb4_|Bb Ab Ab G|F__@|F_ G Ab|G F Eb Ab|G_ F_|Eb__@]", "s").harmonise();
new JSB.Piece("A major").parse("[A4|A A (F#/,G#/) A|(B/,A/) G# F#_@|G# A B E4/ F#/|(G#/,A/) F# E@]", "s").parse("[A3|A2 C# D F#|D# E B_@|G# F# E G#/ A/|B B2 E@]", "b").harmonise();
new JSB.Piece("F# minor").parse("[F#4 F# F# G#|A G# F#_|D F# F# E#|F#__]", "s").harmonise({
    dictionary: JSB.Dict.PRIMARY_A
});
new JSB.Piece("Bb major").parse("[Bb4 Bb/. C// D Bb|G C/ Bb/ A_]", "s").harmonise();