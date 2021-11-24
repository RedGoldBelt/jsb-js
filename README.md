# JSB.js
JSB.js is a JavaScript application for harmonising music in the style of Bach Chorales.

It will take a soprano part (and other parts if given), and assign chords to each note. Simultaneously, it creates a realisation of the chords.
JSB.js follows common principles of good harmonisation and part writing:

* Cadences are perfect, imperfect, interrupted, or plagal. This means that the chords leading up to cadences must follow certain patterns. 
* The notes of parts which have been specified should fit the chord.
* Second inversion chords should only be used in passing or in cadences.
* The proportions of notes in a chord should be valid. An example of this rule is the fact that the third in a chord must never be doubled.
* There will be no parallel fifths or octaves between parts.
* Melodies must be as conjunct as possible.
* Parts must not cross.
* The notes must not exceed the tessitura of the part.

Importantly, JSB.js employs a heuristic algorithm, which is not based on machine learning. The database that determines which chord to try is manually calculated and compiled.

## Installation

### node.js

`npm install jsb-js`

`import * as JSB from "jsb";`

### Browser

`<script type="module" src="https://unpkg.com/jsb-js"></script>`

`import * as JSB from "jsb";`

## Usage

Example usage:

`const gstq = new JSB.Piece("G major", "[G4 G A|F#. G/ A|B@ B C|B. A/ G|A G F#|G_.@]").harmonise();`

The constructor `JSB.Piece` is of the form:

`constructor(homeKey, s, a?, t?, b?)`

The key is written in the format `"<A|B|C|D|E|F|G><|#|b> <major|minor>"`, which is CASE-SENSITIVE.

The soprano part is required. Other parts are optional. If you specify other parts, ensure that the rhythm matches that of the soprano. Only completely homophonic inputs are allowed (for the moment).

The string for a part follows a structure:

`"[...|...|...]"`

The first and last characters are brackets, and bars are delimited by the character "|". Bars can be of any length, hence anacruses are supported.

The notes within a bar are delimited by spaces:

`"...|G A B|..."`

The first note in the piece must have an octave number attached. Other notes do not require. The closest note to the previous note determines the octave of those notes. However, if the interval between two notes is greater than 6 semitones, you should specify an octave number:

`"[C5 Ab Eb5|..."`

The duration of a note is appended after its pitch. You can use any combination of the characters "/", "." or "\_" which multiply the default duration of one crotchet by 0.5, 1.5, and 2 respectively:

`"[G#4. F#/ E|A_.|..."`

Finally, you can annotate a note as being the final chord of a cadence (often signified with a fermata) by appending the character "@" after the duration.

`"[...|D5. C#/ B E|A4_.@ G#|A B C# C#|..."`

To harmonise the piece, call the harmonise() method on it. You can optionally specify configuration options:

`const myPiece = new JSB.Piece(...).harmonise({ dictionary: JSB.DICT.PRIMARY_AB, debug: true });`

Configuration options default to JSB.FULL, false.

Sample output:


`new JSB.Piece("G major", "[G4 G A|F#. G/ A|B@ B C|B. A/ G|A G F#|G_.@]").harmonise();`
```
[G4     G4     A4    |F#4    G4     A4    |B4     B4     C5    |B4     A4     G4    |A4     G4     F#4   |G4    ]
[D4     E4     E4    |F#4    E4     D4    |D4     E4     E4    |G4     D4     D4    |E4     B3     C4    |D4    ]
[B3     B3     C4    |B3     B3     A3    |G3     B3     A3    |G3     F#3    G3    |G3     G3     A3    |B3    ]
[G3     E3     E3    |D3     E3     F#3   |G3     G3     A3    |D3     C3     B2    |C3     D3     D3    |G3    ]
[I      vi     iic   |iiib   vi     Vb    |I      vib    ii    |Ic     V7d    Ib    |ii7b   Ic     V7    |I     ]
```
Copyright Jeremy Chen
