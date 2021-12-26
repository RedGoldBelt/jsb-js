import Dictionary from './dictionary.js';
import DictionaryFull from './dictionary_full.js';
import Key from './key.js';
import Parts from './parts.js';
import Tessitura from './tessitura.js';

export default class Config {
  key = Key.parse('C major');
  dictionary: Dictionary = new DictionaryFull();
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
