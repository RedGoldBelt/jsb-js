# JSB.js

JSB.js is a JavaScript application for harmonising music in the style of Bach Chorales.

It takes a soprano part (and optionally other parts), and assign chords to each note. Simultaneously, it realises chords to apply rules on part writing.
JSB.js follows common principles of good harmonisation and part writing:

- Cadential chords follow defined patterns.
- Notes of parts which have been specified should fit the chord.
- Second inversion chords should only be used in passing or in cadences.
- The proportions of notes in a chord should be valid.
- There will be no parallel fifths or octaves between parts.
- Melodies must be as conjunct as possible.
- Parts must not cross.
- Notes must not exceed the tessitura of the part.

Importantly, JSB.js employs a heuristic algorithm, which is not based on machine learning. The database that determines which chord to try is manually calculated and compiled.

## Installation

`npm install jsb-js`

`import JSB from "jsb-js";`

## Usage

Example usage:

`const gstq = new JSB.Piece().setKey(JSB.Key.parse("G major")).load("[G4 G A|F#. G/ A|B@ B C|B. A/ G|A G F#|G_.@]", "s").harmonise();`

The key is written in the format `"<A|B|C|D|E|F|G><|#|b> <major|minor>"`, which is CASE-SENSITIVE.

The string for a part follows a syntax. Bars are delimited by the "|" character, and can be of any length.
The notes within a bar are delimited by spaces:

`"...|G A B|..."`

The first note must have an octave number attached. Subsequent notes do not require one, as the closest note to the previous note is the determining factor. However, if the interval between two notes is greater than 6 semitones, you should specify an octave number:

`"[C5 Ab Eb5|..."`

The duration of a note is appended after its pitch. Use a combination of the characters "\_", "/" or "." which multiply the default duration of one crotchet by 2, 0.5, and 1.5 respectively:

`"[G#4. F#/ E|A_.|..."`

Finally, you can annotate a note as being the final chord of a cadence (like a fermata) by appending the character "@" after the duration.

`"[...|D5. C#/ B E|A4_.@ G#|A B C# C#|..."`

To harmonise the piece, call the harmonise() method on it.

You can change the dictionary that is used.

`const myPiece = new JSB.Piece().setKey(...).load(...).configure("dictionary", JSB.Dict.PRIMARY_AB).harmonise();`

Copyright Jeremy Chen
