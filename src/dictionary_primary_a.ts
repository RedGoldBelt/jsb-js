import Dictionary from './dictionary.js';

export default class DictionaryPrimaryA extends Dictionary {
  protected common = {
    major: {
      start: ['I/I', 'IV/I', 'V/I'],
      I: ['IV', 'V', 'I'],
      IV: ['V', 'I', 'IV'],
      V: ['I', 'IV', 'V'],
    },
    minor: {
      start: ['i/i', 'iv/i', 'V/i'],
      i: ['iv', 'V', 'i'],
      iv: ['V', 'i', 'iv'],
      V: ['i', 'iv', 'V'],
    },
  };

  protected specific = {};
}
