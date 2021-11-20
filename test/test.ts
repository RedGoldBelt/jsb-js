const jsb = require("jsb");

const GSTQ = new jsb.Piece().load("G major", "[G4 G A|F#. G/ A|B@ B C|B. A/ G|A G F#|G_.@]").harmonise(jsb.DICT_FULL);

const HTHAS = new jsb.Piece().load("G major", "[D G G. F#/|G@ B B A@|D D C_|B A B_@]").harmonise(jsb.DICT_FULL);

const M1 = new jsb.Piece().load("C major", "[C5|A F G C|C B C@ D|E C D B|C_.@]").harmonise(jsb.DICT_FULL);

const M1_SIMPLE = new jsb.Piece().load("C major", "[C5|A F G C|C B C@ D|E C D B|C_.@]").harmonise(jsb.DICT_PRIMARY_a_b);

const KMSR = new jsb.Piece().load("D major", "[A4|F# F# G|A D A|G E5 A4|F#_@ A|D C# B|A. G/ F#|E D C#|D_@]").harmonise(jsb.DICT_FULL);

const C2 = new jsb.Piece().load("A major", "[C#5 | A B C# F# | E C# B_@| D D C# C# | B B A_ @]").harmonise(jsb.DICT_FULL);

const HYMN_3 = new jsb.Piece().load("D major", "[A4_ F# G|F# E D_@|F#_ A A|B_ A_@|A_ B C#|D_ A_@|D. C#/ B C#|B_ A_@|D_ A B|A G F#_@|G. F#/ G A|G F# E_@|A_ D4 G|F#_ E_|D__@]").harmonise(jsb.DICT_FULL);

const HYMN_8 = new jsb.Piece().load("Ab major", "[Eb4|Ab G F Eb|Ab_ Bb.@ Bb/|Eb C Ab G|F_. Ab|Eb5 C Ab Ab|Bb_ Eb4@ Ab|F Db Eb G|Ab_.@]").harmonise(jsb.DICT_FULL);

const HYMN_10 = new jsb.Piece().load("Eb major", "[G4_ G F|Eb_ Bb4_|C Bb Bb Ab|G__@|G_ Ab Bb|C_ Bb_|Ab F G Ab|Bb__@|G_ G F|Eb_ Bb4_|Bb Ab Ab G|F__@|F_ G Ab|G F Eb Ab|G_ F_|Eb__@]").harmonise(jsb.DICT_FULL);