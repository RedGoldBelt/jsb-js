import Dictionary from "./dictionary.js";

export default class DictionaryPrimaryAB extends Dictionary {
    protected common = {
      major: {
          start: ['I/I', 'Ib/I', 'IVb/I', 'IV/I', 'V/I', 'Vb/I'],
        I: ['IVb', 'IV', 'Vb', 'V', 'Ib', 'I'],
        Ib: ['IV', 'IVb', 'V', 'Vb', 'I', 'Ib'],
        IV: ['Vb', 'V', 'Ib', 'I', 'IVb', 'IV'],
        IVb: ['V', 'Vb', 'I', 'Ib', 'IV', 'IVb'],
        V: ['Ib', 'I', 'IVb', 'IV', 'Vb', 'V'],
        Vb: ['I', 'Ib', 'IV', 'IVb', 'V', 'Vb'],
      },
      minor: {
        start: ['i/i', 'ib/i', 'ivb/i', 'iv/i', 'V/i', 'Vb/i'],
        i: ['ivb', 'iv', 'Vb', 'V', 'ib', 'i'],
        ib: ['iv', 'ivb', 'V', 'Vb', 'i', 'ib'],
        iv: ['Vb', 'V', 'ib', 'i', 'ivb', 'iv'],
        ivb: ['V', 'Vb', 'i', 'ib', 'iv', 'ivb'],
        V: ['ib', 'i', 'ivb', 'iv', 'Vb', 'V'],
        Vb: ['i', 'ib', 'iv', 'ivb', 'V', 'Vb'],
      },
    };

    protected specific = {};
  };