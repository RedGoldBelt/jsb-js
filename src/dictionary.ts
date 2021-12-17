import Util from './util';

namespace Dict {
  export const FULL: Util.Dictionary = {
    start: {
      major: ['I/I', 'V/I', 'IV/I', 'ii/I', 'vi/I', 'iii/I'],
      minor: ['i/i', 'iv/i', 'V/i'],
    },
    common: {
      major: {
        I: [
          'viib',
          'iiic',
          'iiib',
          'iii',
          'vic',
          'vib',
          'vi',
          'ii7d',
          'ii7c',
          'ii7b',
          'ii7',
          'iic',
          'iib',
          'ii',
          'IVc',
          'IVb',
          'IV',
          'V7d',
          'V7c',
          'V7b',
          'V7',
          'Vc',
          'Vb',
          'V',
          'Ic',
          'Ib',
          'I',
        ],
        Ib: ['IV', 'ii7b', 'ii7', 'iib', 'ii', 'V7d', 'V7c', 'Vc', 'vi', 'Ic', 'I'],
        Ic: ['V7', 'V'],
        ii: ['Ic', 'V', 'vi', 'iii', 'IV'],
        iib: ['Ic', 'V'],
        iic: ['iiib'],
        ii7: ['Ic', 'V'],
        ii7b: ['Ic', 'V'],
        ii7d: ['Vb'],
        iii: ['viib', 'vi', 'IV', 'ii', 'vi'],
        iiib: ['vi'],
        IV: ['vi', 'vii', 'iii', 'Ic', 'I', 'V', 'ii'],
        IVb: ['vii', 'Ic', 'I'],
        V: ['iiic', 'iiib', 'iii', 'vi', 'iic', 'iib', 'ii', 'IV', 'Ic', 'Ib', 'I', 'Vb'],
        Vb: ['vi', 'I'],
        Vc: ['Ib', 'I'],
        V7: ['vi', 'I'],
        V7b: ['iiib', 'iii', 'vi', 'I'],
        V7c: ['Ib', 'I'],
        V7d: ['iii', 'Ib'],
        vi: ['ii7d', 'ii7c', 'ii7b', 'ii7', 'iic', 'iib', 'ii', 'iiic', 'iiib', 'iii', 'Vb', 'V', 'IVb', 'IV', 'Ib'],
        vib: ['ii'],
        vii: ['V/vi', 'iii', 'ii', 'V'],
        viib: ['V/vi', 'I', 'iii'],
      },
      minor: {
        'i': ['VI', 'V7d', 'V7c', 'V7b', 'V7', 'Vc', 'Vb', 'V', '#viib'],
        'ib': ['i'],
        'III': ['VI'],
        'iv': ['III', 'iv'],
        'V': ['bIIb', 'i'],
        'Vb': ['i'],
        'Vc': ['ib', 'i'],
        'V7': ['i'],
        'V7b': ['i'],
        'V7c': ['ib', 'i'],
        'V7d': ['ib'],
        '#viib': ['ib', 'i'],
        '#viic': [],
        '#viio7': ['i'],
        '#viio7b': ['ib', 'i'],
        '#viio7c': ['ib'],
        '#viio7d': ['ic'],
      },
    },
    specific: {
      I: {
        I: ['vii7/V'],
        V: ['vii/V', 'V7d/V', 'V7c/V', 'V7b/V', 'V7/V'],
        vi: ['Vb/V'],
      },
      V: {
        I: ['V/I'],
        V7b: ['Ic/I', 'V/I'],
        V7c: ['Vb/I'],
        vii7: ['Ic/I', 'V/I'],
      },
    },
  };

  export const PRIMARY_A: Util.Dictionary = {
    start: {
      major: ['I/I', 'IV/I', 'V/I'],
      minor: ['i/i', 'iv/i', 'V/i'],
    },
    common: {
      major: {
        I: ['IV', 'V', 'I'],
        IV: ['V', 'I', 'IV'],
        V: ['I', 'IV', 'V'],
      },
      minor: {
        i: ['iv', 'V', 'i'],
        iv: ['V', 'i', 'iv'],
        V: ['i', 'iv', 'V'],
      },
    },
  }; // Complete

  export const PRIMARY_AB: Util.Dictionary = {
    start: {
      major: ['I/I', 'Ib/I', 'IVb/I', 'IV/I', 'V/I', 'Vb/I'],
      minor: ['i/i', 'ib/i', 'ivb/i', 'iv/i', 'V/i', 'Vb/i'],
    },
    common: {
      major: {
        I: ['IVb', 'IV', 'Vb', 'V', 'Ib', 'I'],
        Ib: ['IV', 'IVb', 'V', 'Vb', 'I', 'Ib'],
        IV: ['Vb', 'V', 'Ib', 'I', 'IVb', 'IV'],
        IVb: ['V', 'Vb', 'I', 'Ib', 'IV', 'IVb'],
        V: ['Ib', 'I', 'IVb', 'IV', 'Vb', 'V'],
        Vb: ['I', 'Ib', 'IV', 'IVb', 'V', 'Vb'],
      },
      minor: {
        i: ['ivb', 'iv', 'Vb', 'V', 'ib', 'i'],
        ib: ['iv', 'ivb', 'V', 'Vb', 'i', 'ib'],
        iv: ['Vb', 'V', 'ib', 'i', 'ivb', 'iv'],
        ivb: ['V', 'Vb', 'i', 'ib', 'iv', 'ivb'],
        V: ['ib', 'i', 'ivb', 'iv', 'Vb', 'V'],
        Vb: ['i', 'ib', 'iv', 'ivb', 'V', 'Vb'],
      },
    },
  }; // Complete

  export const PRIMARY_ABC: Util.Dictionary = {
    start: {
      major: ['I/I', 'Ib/I', 'Ic/I', 'IVc/I', 'IVb/I', 'IV/I', 'V/I', 'Vb/I', 'Vc/I'],
      minor: [],
    },
    common: {
      major: {
        I: ['IVb', 'IV', 'Vb', 'V', 'Ib', 'I'],
        Ib: ['IV', 'IVb', 'V', 'Vb', 'I', 'Ib'],
        IV: ['Vb', 'V', 'Ib', 'I', 'IVb', 'IV'],
        IVb: ['V', 'Vb', 'I', 'Ib', 'IV', 'IVb'],
        V: ['Ib', 'I', 'IVb', 'IV', 'Vb', 'V'],
        Vb: ['I', 'Ib', 'IV', 'IVb', 'V', 'Vb'],
        Vc: [],
      },
      minor: {
        start: ['i', 'ib', 'ivb', 'iv', 'V', 'Vb'],
        i: ['ivb', 'iv', 'Vb', 'V', 'ib', 'i'],
        ib: ['iv', 'ivb', 'V', 'Vb', 'i', 'ib'],
        iv: ['Vb', 'V', 'ib', 'i', 'ivb', 'iv'],
        ivb: ['V', 'Vb', 'i', 'ib', 'iv', 'ivb'],
        V: ['ib', 'i', 'ivb', 'iv', 'Vb', 'V'],
        Vb: ['i', 'ib', 'iv', 'ivb', 'V', 'Vb'],
      },
    },
  };
}

export default Dict;
