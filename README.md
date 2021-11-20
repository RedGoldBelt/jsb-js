# JChord
JChord is a JavaScript application for harmonising music in the style of Bach Chorales.
It will take a soprano part (and other parts if given), and assign chords to each note. Simultaneously, it creates a realisation of the chords.
JChord follows common principles of good harmonisation and part writing:

* Cadences are perfect, imperfect, interrupted, or plagal. This means that the chords leading up to cadences must follow certain patterns. 
* The notes of parts which have been specified should fit the chord.
* Second inversion chords should only be used in passing or in cadences.
* The proportions of notes in a chord should be valid. An example of this rule is the fact that the third in a chord must never be doubled.
* There will be no parallel fifths or octaves between parts.
* Melodies must be as conjunct as possible.
* Parts must not cross.
* The notes must not exceed the tessitura of the part.

Importantly, JChord employs a heuristic algotrithm, which is not based on machine learning. The database that determines which chord to try is manually calculated and compiled.

Author: Jeremy Chen
