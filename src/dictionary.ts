import Chord from './chord.js';
import Util from './util.js';

export default abstract class Dictionary {
  protected abstract common: {
    major: any;
    minor: any;
  };

  protected abstract specific: any;

  progression(chord: Chord, type: Util.EventType) {
    const options = this.progressionSpecific(chord).concat(this.progressionCommon(chord));
    switch (type) {
      case 'normal':
        return options;
      case 'cadence':
        return options.filter(chord => ['I', 'i', 'V', 'VI', 'vi'].includes(chord.stringStem()));
      case 'end':
        return options.filter(chord => ['I/I', 'I/i', 'V/I'].includes(chord.string()));
      default:
        throw `Invalid event type '${type}'.`;
    }
  }

  protected progressionSpecific(chord: Chord) {
    if (chord.base === undefined) {
      return [];
    }
    const options = this.specific[chord.relativeKey.string()]?.[chord.stringStem()] as string[];
    return options?.map(Chord.parse) ?? [];
  }

  protected progressionCommon(chord: Chord) {
    if (chord.base === undefined) {
      return (chord.relativeKey.tonality ? this.common.major.start : this.common.minor.start).map(Chord.parse);
    }
    const common = (chord.relativeKey.tonality ? this.common.major : this.common.minor)[chord.stringStem()] as string[];
    return (
      common?.map(Chord.parse).map(option => {
        option.relativeKey = chord.relativeKey;
        return option;
      }) ?? []
    );
  }
}
