import Chord from './chord.js';
import { EventType } from './event.js';

export default class Dictionary {
  static Full: Dictionary;
  static Bach: Dictionary;
  static PrimaryA: Dictionary;
  static PrimaryAB: Dictionary;
  static PrimaryABC: Dictionary;

  private common;
  private specific;

  private static map<V, M>(obj: { [key: string]: V }, fn: (v: V) => M) {
    return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, fn(value)]));
  }

  constructor(
    common: {
      major: { [key: string]: string[] };
      minor: { [key: string]: string[] };
    },
    specific: {
      [key: string]: { [key: string]: string[] };
    }
  ) {
    this.common = {
      major: Dictionary.map(common.major, list => list.map(Chord.parse)),
      minor: Dictionary.map(common.minor, list => list.map(Chord.parse))
    };
    this.specific = Dictionary.map(specific, options =>
      Dictionary.map<string[], Chord[]>(options, list => list.map(Chord.parse))
    );
  }

  progression(chord: Chord, type: EventType) {
    const options = this.progressionSpecific(chord).concat(this.progressionCommon(chord));
    switch (type) {
      case 'normal':
        return options;
      case 'cadence':
        return options.filter(chord => ['I', 'i', 'V', 'VI', 'vi'].includes(chord.stringStem()));
      case 'end':
        return options.filter(chord => ['I/I', 'I/i', 'V/I'].includes(chord.string()));
    }
  }

  protected progressionCommon(chord: Chord) {
    const buffer = chord.relativeKey.tonality ? this.common.major : this.common.minor;
    if (chord.base === undefined) {
      return buffer.start;
    }
    const common = buffer[chord.stringStem()];
    return (
      common?.map(option => {
        option.relativeKey = chord.relativeKey;
        return option;
      }) ?? []
    );
  }

  protected progressionSpecific(chord: Chord) {
    if (chord.base === undefined) {
      return [];
    }
    return this.specific[chord.relativeKey.string()]?.[chord.stringStem()] ?? [];
  }
}

Dictionary.Full = new Dictionary(
  {
    major: {
      start: ['I/I', 'V/I', 'IV/I', 'ii/I', 'vi/I', 'iii/I'],
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
        'I'
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
      viib: ['V/vi', 'I', 'iii']
    },
    minor: {
      'start': ['i/i', 'iv/i', 'V/i'],
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
      '#viio7d': ['ic']
    }
  },
  {
    I: {
      I: ['vii7/V'],
      V: ['vii/V', 'V7d/V', 'V7c/V', 'V7b/V', 'V7/V'],
      vi: ['Vb/V']
    },
    V: {
      I: ['V/I'],
      V7b: ['Ic/I', 'V/I'],
      V7c: ['Vb/I'],
      vii7: ['Ic/I', 'V/I']
    }
  }
);

Dictionary.Bach = new Dictionary(
  {
    major: {
      start: ['I/I'],
      I: ['viib', 'V7c', 'V7', 'ii', 'viio7c', 'ii7b', 'Vb', 'vi', 'IV', 'I', 'Ib', 'V'],
      Vb: ['V', 'I'],
      vi: ['Ib', 'iii', 'ii', 'vi', 'IV', 'iib', 'ii7b', 'V', 'Vb'],
      Ib: ['ii', 'viib', 'IV', 'ii7b', 'I', 'V'],
      IV: ['ii7b', 'vi', 'IVb', 'viib', 'I', 'Ib'],
      IVb: ['I'],
      viib: ['Ib', 'iii7', 'IV', 'I'],
      V7b: ['V7', 'I'],
      ii7b: ['iiib', 'Ic', 'V'],
      V: ['V7', 'Ib', 'vi', 'V', 'Vb', 'I'],
      iiib: ['IV7b'],
      IV7b: ['V7b'],
      V7: ['Ib', 'V7', 'I'],
      ii: ['vi', 'I', 'V', 'Vb'],
      iib: ['V', 'ii', 'V7d'],
      iii: ['V7b', 'IV'],
      iii7: ['vi'],
      V7c: ['Ib'],
      Ic: ['V'],
      ii7: ['V7'],
      Vc: ['I'],
      V7d: ['Ib'],
      viio7c: ['V7d']
    },
    minor: {
      'start': ['V/i', 'iv/v', 'vi/VI', 'vi/III', 'i/i'],
      'V': ['bIIb', 'V7d', 'V', 'V7', 'VI', 'ic', 'ib', 'I', 'i'],
      'i': ['V7b', 'ii7b', 'V7', 'iv7', '#viib', 'VI', 'iib', 'Vb', 'ivb', 'iv', 'ib', 'i', 'V'],
      '#viib': ['ib', 'i'],
      'ib': ['iv', 'V7b', 'Vc', 'V', 'ii7b', 'iib', 'v', 'V7c', 'i', '#viib'],
      'Vb': ['V', 'VIb', 'i'],
      'V7b': ['i'],
      'iv': ['Vb', '#viio7c', '#viib', 'ib', 'i', 'ivb', 'I', 'V7', 'V'],
      'ivb': ['iv', 'ivb', 'ic', 'V'],
      'ii7c': ['V'],
      'Vc': ['i'],
      'V7c': ['i'],
      'ii7b': ['ib', 'V'],
      '#viio7c': ['i'],
      'III': ['I', 'V7b'],
      'I': ['#viib'],
      'IV': ['Vb', '#viic'],
      'V7': ['I', 'i', 'VI'],
      'VI': ['III', 'iv', 'ii7b', 'V'],
      'V7d': ['ib'],
      'iib': ['V'],
      'iv7': ['V'],
      'IIb': ['ivb'],
      'VII': ['iv'],
      'ic': ['V'],
      '#viic': ['ib'],
      'v': ['iic']
    }
  },
  {
    I: { Ib: ['V7b/V'], vi: ['V/V', 'V7b/V'], I: ['Vb/vi', 'iib/V', 'i/vi'], V7d: ['viio7/V'] },
    V: { I: ['I/I', 'VII/vi', 'V/I'], V7b: ['V/I', 'V7/I'], viio7: ['V/I'] },
    i: {
      'bIIb': ['#viio7/v'],
      'V': ['#viio7b/v', 'vi/III'],
      'i': ['iv/v', 'ib/iv', 'V7/III', 'V7b/VII', 'i/v', 'viib/III', 'vi/III', 'Vb/III'],
      '#viib': ['IV/v'],
      'I': ['i/iv'],
      'VIb': ['V7b/III'],
      'ic': ['viib/III'],
      'iic': ['V7d/iv']
    },
    v: {
      '#viio7': ['V/i'],
      '#viio7b': ['V7b/i'],
      'V': ['iii/III'],
      'I': ['V/i'],
      'i': ['viib/VII'],
      'ib': ['ib/iv']
    },
    III: {
      V: ['ii7c/i', 'Vb/i'],
      I: ['III/i', 'Vb/i', 'V7/i', 'i/i', 'V/i', 'iv/i', 'V7c/i'],
      Ib: ['Vb/iv', 'V/i'],
      Vb: ['iv/i', 'IV/i']
    },
    iv: { i: ['iv/v', 'vi/VI', 'V/VII'], ib: ['ii7/VI', 'iv/i'], V: ['vi/VI'] },
    vi: { i: ['#viib/ii', 'iii/IV'], V: ['iib/V', '#viio7/iii'] },
    ii: { i: ['Ib/I'] },
    VII: { I: ['i/i', 'V/III', 'Vc/III'] },
    VI: { V: ['i/i'], I: ['ii7b/i', 'iv/i', 'IIb/iv'] },
    iii: { '#viio7': ['V/vi'] },
    IV: { Ib: ['Ib/I'] }
  }
);

Dictionary.PrimaryA = new Dictionary(
  {
    major: {
      start: ['I/I', 'IV/I', 'V/I'],
      I: ['IV', 'V', 'I'],
      IV: ['V', 'I', 'IV'],
      V: ['I', 'IV', 'V']
    },
    minor: {
      start: ['i/i', 'iv/i', 'V/i'],
      i: ['iv', 'V', 'i'],
      iv: ['V', 'i', 'iv'],
      V: ['i', 'iv', 'V']
    }
  },
  {}
);

Dictionary.PrimaryAB = new Dictionary(
  {
    major: {
      start: ['I/I', 'Ib/I', 'IVb/I', 'IV/I', 'V/I', 'Vb/I'],
      I: ['IVb', 'IV', 'Vb', 'V', 'Ib', 'I'],
      Ib: ['IV', 'IVb', 'V', 'Vb', 'I', 'Ib'],
      IV: ['Vb', 'V', 'Ib', 'I', 'IVb', 'IV'],
      IVb: ['V', 'Vb', 'I', 'Ib', 'IV', 'IVb'],
      V: ['Ib', 'I', 'IVb', 'IV', 'Vb', 'V'],
      Vb: ['I', 'Ib', 'IV', 'IVb', 'V', 'Vb']
    },
    minor: {
      start: ['i/i', 'ib/i', 'ivb/i', 'iv/i', 'V/i', 'Vb/i'],
      i: ['ivb', 'iv', 'Vb', 'V', 'ib', 'i'],
      ib: ['iv', 'ivb', 'V', 'Vb', 'i', 'ib'],
      iv: ['Vb', 'V', 'ib', 'i', 'ivb', 'iv'],
      ivb: ['V', 'Vb', 'i', 'ib', 'iv', 'ivb'],
      V: ['ib', 'i', 'ivb', 'iv', 'Vb', 'V'],
      Vb: ['i', 'ib', 'iv', 'ivb', 'V', 'Vb']
    }
  },
  {}
);

Dictionary.PrimaryABC = new Dictionary(
  {
    major: {
      start: ['I/I', 'Ib/I', 'Ic/I', 'IVc/I', 'IVb/I', 'IV/I', 'V/I', 'Vb/I', 'Vc/I'],
      I: ['IVb', 'IV', 'Vb', 'V', 'Ib', 'I'],
      Ib: ['IV', 'IVb', 'V', 'Vb', 'I', 'Ib'],
      IV: ['Vb', 'V', 'Ib', 'I', 'IVb', 'IV'],
      IVb: ['V', 'Vb', 'I', 'Ib', 'IV', 'IVb'],
      V: ['Ib', 'I', 'IVb', 'IV', 'Vb', 'V'],
      Vb: ['I', 'Ib', 'IV', 'IVb', 'V', 'Vb'],
      Vc: []
    },
    minor: {
      start: ['i', 'ib', 'ivb', 'iv', 'V', 'Vb'],
      i: ['ivb', 'iv', 'Vb', 'V', 'ib', 'i'],
      ib: ['iv', 'ivb', 'V', 'Vb', 'i', 'ib'],
      iv: ['Vb', 'V', 'ib', 'i', 'ivb', 'iv'],
      ivb: ['V', 'Vb', 'i', 'ib', 'iv', 'ivb'],
      V: ['ib', 'i', 'ivb', 'iv', 'Vb', 'V'],
      Vb: ['i', 'ib', 'iv', 'ivb', 'V', 'Vb']
    }
  },
  {}
);
