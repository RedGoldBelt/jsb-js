import JSB from "../src/jsb.js";

const GSTQ = new JSB.Piece().load("G major", "[G4 G A|F#. G/ A|B@ B C|B. A/ G|A G F#|G_.@]").harmonise(JSB.DICT_FULL);

const HTHAS = new JSB.Piece().load("G major", "[D G G. F#/|G@ B B A@|D D C_|B A B_@]").harmonise(JSB.DICT_FULL);

const M1 = new JSB.Piece().load("C major", "[C5|A F G C|C B C@ D|E C D B|C_.@]").harmonise(JSB.DICT_FULL);

const M1_SIMPLE = new JSB.Piece().load("C major", "[C5|A F G C|C B C@ D|E C D B|C_.@]").harmonise(JSB.DICT_PRIMARY_a_b);

const KMSR = new JSB.Piece().load("D major", "[A4|F# F# G|A D A|G E5 A4|F#_@ A|D C# B|A. G/ F#|E D C#|D_@]").harmonise(JSB.DICT_FULL);

const C2 = new JSB.Piece().load("A major", "[C#5 | A B C# F# | E C# B_@| D D C# C# | B B A_ @]").harmonise(JSB.DICT_FULL);

const HYMN_3 = new JSB.Piece().load("D major", "[A4_ F# G|F# E D_@|F#_ A A|B_ A_@|A_ B C#|D_ A_@|D. C#/ B C#|B_ A_@|D_ A B|A G F#_@|G. F#/ G A|G F# E_@|A_ D4 G|F#_ E_|D__@]").harmonise(JSB.DICT_FULL);

const HYMN_8 = new JSB.Piece().load("Ab major", "[Eb4|Ab G F Eb|Ab_ Bb.@ Bb/|Eb C Ab G|F_. Ab|Eb5 C Ab Ab|Bb_ Eb4@ Ab|F Db Eb G|Ab_.@]").harmonise(JSB.DICT_FULL);

const HYMN_10 = new JSB.Piece().load("Eb major", "[G4_ G F|Eb_ Bb4_|C Bb Bb Ab|G__@|G_ Ab Bb|C_ Bb_|Ab F G Ab|Bb__@|G_ G F|Eb_ Bb4_|Bb Ab Ab G|F__@|F_ G Ab|G F Eb Ab|G_ F_|Eb__@]").harmonise(JSB.DICT_FULL);