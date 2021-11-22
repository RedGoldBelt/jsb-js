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

Importantly, JSB.js employs a heuristic algotrithm, which is not based on machine learning. The database that determines which chord to try is manually calculated and compiled.

## Installation

`npm install jsb-js`

Run this command in your terminal to install jsb-js.

`import * as JSB from "../node_modules/jsb-js/dist/index.js";`

JSB.js uses ES6 modules; do not use `const JSB = require("jsb-js");`

## Usage

Example usage:

`const gstq = new JSB.Piece("G major", "[G4 G A|F#. G/ A|B@ B C|B. A/ G|A G F#|G_.@]").harmonise();`

The constructor `JSB.Piece` requires is of the form:

`constructor(homeKey, s, a?, t?, b?)`

The key is written in the format `"<tone> <major|minor>"`, which is CASE-SENSITIVE.
Accidentals are notated as such: `"Eb major"` or `"F# major"`.

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

To harmonise the piece, call the harmonise() method on it. You can optionally specify parameters in the argument:

`const myPiece = new JSB.Piece(...).harmonise({
    dictionary: <JSB.DICTIONARY_FULL|JSB.DICTIONARY_PRIMARY_a_b>, // Default JSB.DICTIONARY_FULL
    debug: <true|false> // Default false
});`

Note: JSB.DICTIONARY_FULL is incomplete at the moment.

Author: Jeremy Chen
