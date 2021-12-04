import * as JSB from "../dist/index.js";

new JSB.Piece().setKey("G major").parse("[(G4/,F#4/) G4 A4|F#4. G4/ A4|B4 B4 C5|B4. A4/ G4|A4 G4 F#4|G4_.]", "s").harmonise();
new JSB.Piece().setKey("G major").parse("[D4 G4 G4. F#4/|G4@ B4 B4 A4@|D5 D5 (C5.,C5/)|B4 A4 B4_@]", "s").harmonise();
new JSB.Piece().setKey("C major").parse("[C5|A4 F4 G4 C5|C5 B4 C5@ D5|E5 C5 D5 B4|C5_.@]", "s").harmonise();
new JSB.Piece({dictionary: JSB.Dict.PRIMARY_AB}).setKey("C major").parse("[C5|A4 F4 G4 C5|C5 B4 C5@ D5|E5 C5 D5 B4|C5_.@]", "s").harmonise();
new JSB.Piece().setKey("D major").parse("[A4|F#4 F#4 G4|A4 D5 A4|G4 E5 A4|F#4_@ A4|D5 C#5 B4|A4. G4/ F#4|E4 D4 C#4|D4_@]", "s").harmonise();
new JSB.Piece().setKey("A major").parse("[C#5|A4 B4 C#5 F#5|(E5/,D5/) C#5 B4_@|D5 D5 (C#5/,B4/) C#5|B4 B4 A4_@]", "s").harmonise();
new JSB.Piece().setKey("D major").parse("[A4_ F#4 G4|F#4 E4 D4_@|F#4_ A4 A4|B4_ A4_@|A4_ B4 C#5|D5_ A4_@|D5. C#5/ B4 C#5|B4_ A4_@|D5_ A4 B4|A4 G4 F#4_@|G4. F#4/ G4 A4|G4 F#4 E4_@|A4_ D4 G4|F#4_ E4_|D4__@]", "s").harmonise();
new JSB.Piece().setKey("Ab major").parse("[Eb4|Ab4 G4 F4 Eb4|(Ab4,Ab4) (Bb4,C5/,Db5/)|Eb5 C5 Ab4 G4|F4. Ab4|Eb5 C5 Ab4 Ab4|Bb4_ Eb4@ Ab4|F4 Db4 Eb4 G4|Ab4_.@]", "s").harmonise();
new JSB.Piece().setKey("Eb major").parse("[G4_ G4 F4|Eb4_ Bb4_|C5 Bb4 Bb4 Ab4|G4__@|G4_ Ab4 Bb4|C5_ Bb4_|Ab4 F4 G4 Ab4|Bb4__@|G4_ G4 F4|Eb4_ Bb4_|Bb4 Ab4 Ab4 G4|F4__@|F4_ G4 Ab4|G4 F4 Eb4 Ab4|G4_ F4_|Eb4__@]", "s").harmonise();
new JSB.Piece().setKey("A major").parse("[A4|A4 A4 (F#4/,G#4/) A4|(B4/,A4/) G#4 F#4_@|G#4 A4 B4 E4/ F#4/|(G#4/,A4/) F#4 E4@]", "s").parse("[A3|A2 C#3 D3 F#3|D#3 E3 B2_@|G#2 F#2 E2 G#2/ A2/|B2 B2 E3@]", "b").harmonise();
new JSB.Piece({dictionary: JSB.Dict.PRIMARY_A}).setKey("F# minor").parse("[F#4 F#4 F#4 G#4|A4 G#4 F#4_|D4 F#4 F#4 E#4|F#4__]", "s").harmonise();
new JSB.Piece().setKey("Bb major").parse("[Bb4 Bb4/. C5// D5 Bb4|G4 C5/ Bb4/ A4_]", "s").harmonise();