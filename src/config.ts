import Dict from './dictionary.js';
import Parts from './parts.js';
import Tessitura from './tessitura.js';

export default class Config {
  dictionary = Dict.FULL;
  doubledMajorThird = false;
  doubledMinorThird = true;
  absentFifth = false;
  parallelFifths = false;
  parallelOctaves = false;
  tessiture = new Parts<Tessitura>(
    new Tessitura(46, 67),
    new Tessitura(43, 63),
    new Tessitura(36, 57),
    new Tessitura(28, 53)
  );
}
