import Chord from "./chord.js";
import { FULL, PRIMARY_A, PRIMARY_AB, PRIMARY_ABC } from "./dictionary.js";
import Event from "./event.js";
import Group from "./group.js";
import Key from "./key.js";
import Note from "./note.js";
import Numeral from "./numeral.js";
import Piece from "./piece.js";
import Pitch from "./pitch.js";
import Resolution from "./resolution.js";
import Tone from "./tone.js";
import { Printable } from "./util.js";

const JSB: any = {};

JSB.Tone = Tone;
JSB.Chord = Chord;
JSB.Dict.FULL = FULL;
JSB.Dict.PRIMARY_A = PRIMARY_A;
JSB.Dict.PRIMARY_AB = PRIMARY_AB;
JSB.Dict.PRIMARY_ABC = PRIMARY_ABC;
JSB.Event = Event;
JSB.Group = Group;
JSB.Key = Key;
JSB.Note = Note;
JSB.Numeral = Numeral;
JSB.Piece = Piece;
JSB.Resolution = Resolution;
JSB.Pitch = Pitch;
JSB.Printable = Printable;

export default JSB;
