const FULL: any = {
    COMMON_MAJOR: {
        start: ["I", "V", "IV", "ii", "vi", "iii"],

        "I": [
            "viib",
            "iiic", "iiib", "iii",
            "vic", "vib", "vi",
            "ii7d", "ii7c", "ii7b", "ii7", "iic", "iib", "ii",
            "IVc", "IVb", "IV",
            "V7d", "V7c", "V7b", "V7", "Vc", "Vb", "V",
            "Ic", "Ib", "I"
        ],
        "Ib": [
            "IV",
            "ii7b", "ii7", "iib", "ii",
            "V7d", "V7c", "Vc",
            "vi",
            "Ic", "I"
        ],
        "Ic": [
            "V7", "V"
        ],

        "ii": ["Ic", "V", "vi", "iii", "IV"],
        "iib": ["Ic", "V"],
        "iic": ["iiib"],
        "ii7": ["Ic", "V"],
        "ii7b": ["Ic", "V"],
        "ii7c": [],
        "ii7d": ["Vb"],

        "iii": ["viib", "vi", "IV", "ii", "vi"],
        "iiib": ["vi"],
        "iiic": [],

        "IV": ["vi", "vii", "iii", "Ic", "I", "V", "ii"],
        "IVb": ["vii", "Ic", "I"],
        "IVc": [],

        "V": [
            "iiic", "iiib", "iii",
            "vi",
            "iic", "iib", "ii",
            "IV",
            "Ic", "Ib", "I",
            "Vb"
        ],
        "Vb": ["vi", "I"],
        "Vc": ["Ib", "I"],
        "V7": ["vi", "I"],
        "V7b": ["iiib", "iii", "vi", "I"],
        "V7c": ["Ib", "I"],
        "V7d": ["iii", "Ib"],

        "vi": [
            "ii7d", "ii7c", "ii7b", "ii7", "iic", "iib", "ii",
            "iiic", "iiib", "iii",
            "Vb",
            "V",
            "IVb", "IV",
            "Ib"
        ],
        "vib": ["ii"],
        "vic": [],

        "vii": ["V/vi", "iii", "ii", "V"],
        "viib": ["V/vi", "I", "iii"],
        "viic": [],

        "vii7": [],
        "vii7b": [],
        "vii7c": [],
        "vii7d": [],

        "viio7": [],
        "viio7b": [],
        "viio7c": [],
        "viio7d": []
    },
    COMMON_MINOR: {
        start: ["i", "iv", "V"],

        "i": [
            "VI",
            "V7d", "V7c", "V7b", "V7", "Vc", "Vb", "V",
            "#viib"
        ],
        "ib": ["i"],
        "ic": [],

        "bII": [],
        "bIIb": [],
        "bIIc": [],

        "ii": [],
        "iib": [],
        "iic": [],

        "ii7": [],
        "ii7b": [],
        "ii7c": [],
        "ii7d": [],

        "III": ["VI"],
        "IIIb": [],
        "IIIc": [],

        "iv": ["III", "iv"],
        "ivb": [],
        "ivc": [],

        "V": ["bIIb", "i"],
        "Vb": ["i"],
        "Vc": ["ib", "i"],

        "V7": ["i"],
        "V7b": ["i"],
        "V7c": ["ib", "i"],
        "V7d": ["ib"],

        "VI": [],
        "VIb": [],
        "VIc": [],

        "VII": [],
        "VIIb": [],
        "VIIc": [],

        "#vii": [],
        "#viib": ["ib", "i"],
        "#viic": [],

        "#viio7": ["i"],
        "#viio7b": ["ib", "i"],
        "#viio7c": ["ib"],
        "#viio7d": ["ic"]
    },
    SPECIFIC_I: {
        start: [],

        "I": ["vii7/V"],
        "Ib": [],
        "Ic": [],

        "ii": [],
        "iib": [],
        "iic": [],

        "ii7": [],
        "ii7b": [],
        "ii7c": [],
        "ii7d": [],

        "iii": [],
        "iiib": [],
        "iiic": [],

        "IV": [],
        "IVb": [],
        "IVc": [],

        "V": ["vii/V", "V7d/V", "V7c/V", "V7b/V", "V7/V"],
        "Vb": [],
        "Vc": [],

        "V7": [],
        "V7b": [],
        "V7c": [],
        "V7d": [],

        "vi": ["Vb/V"],
        "vib": [],
        "vic": [],

        "vii": [],
        "viib": [],
        "viic": [],

        "vii7": [],
        "vii7b": [],
        "vii7c": [],
        "vii7d": [],

        "viio7": [],
        "viio7b": [],
        "viio7c": [],
        "viio7d": []
    },
    SPECIFIC_IV: {
        start: ["I", "V", "IV", "ii", "vi", "iii"],

        "I": [],
        "Ib": [],
        "Ic": [],

        "ii": [],
        "iib": [],
        "iic": [],
        "ii7": [],
        "ii7b": [],
        "ii7c": [],
        "ii7d": [],

        "iii": [],
        "iiib": [],
        "iiic": [],

        "IV": [],
        "IVb": [],
        "IVc": [],

        "V": [],
        "Vb": [],
        "Vc": [],
        "V7": [],
        "V7b": [],
        "V7c": [],
        "V7d": [],

        "vi": [],
        "vib": [],
        "vic": [],

        "vii": [],
        "viib": [],
        "viic": [],

        "vii7": [],
        "vii7b": [],
        "vii7c": [],
        "vii7d": [],

        "viio7": [],
        "viio7b": [],
        "viio7c": [],
        "viio7d": []
    },
    SPECIFIC_V: {
        "I": ["V/I"],
        "Ib": [],
        "Ic": [],

        "ii": [],
        "iib": [],
        "iic": [],

        "ii7": [],
        "ii7b": [],
        "ii7c": [],
        "ii7d": [],

        "iii": [],
        "iiib": [],
        "iiic": [],

        "IV": [],
        "IVb": [],
        "IVc": [],

        "V": [],
        "Vb": [],
        "Vc": [],

        "V7": [],
        "V7b": ["Ic/I", "V/I"],
        "V7c": ["Vb/I"],
        "V7d": [],

        "vi": [],
        "vib": [],
        "vic": [],

        "vii": [],
        "viib": [],
        "viic": [],

        "vii7": ["Ic/I", "V/I"],
        "vii7b": [],
        "vii7c": [],
        "vii7d": [],

        "viio7": [],
        "viio7b": [],
        "viio7c": [],
        "viio7d": []
    }
}

const PRIMARY_A: any = {
    COMMON_MAJOR: {
        start: [
            "I",
            "IV",
            "V"
        ],
        "I": [
            "IV",
            "V",
            "I"
        ],
        "IV": [
            "V",
            "I",
            "IV"
        ],
        "V": [
            "I",
            "IV",
            "V"
        ]
    },
    COMMON_MINOR: {
        start: ["i",
            "iv",
            "V"],
        "i": [
            "iv",
            "V",
            "i"],
        "iv": [
            "V",
            "i",
            "iv"
        ],
        "V": [
            "i",
            "iv",
            "V"
        ]
    }
} // Complete

const PRIMARY_AB: any = {
    COMMON_MAJOR: {
        start: [
            "I", "Ib",
            "IVb", "IV",
            "V", "Vb"
        ],
        "I": [
            "IVb", "IV",
            "Vb", "V",
            "Ib", "I"
        ],
        "Ib": [
            "IV", "IVb",
            "V", "Vb",
            "I", "Ib"
        ],
        "IV": [
            "Vb", "V",
            "Ib", "I",
            "IVb", "IV"
        ],
        "IVb": [
            "V", "Vb",
            "I", "Ib",
            "IV", "IVb"
        ],
        "V": [
            "Ib", "I",
            "IVb", "IV",
            "Vb", "V"
        ]
        ,
        "Vb": [
            "I", "Ib",
            "IV", "IVb",
            "V", "Vb"
        ]
    },
    COMMON_MINOR: {
        start: [
            "i", "ib",
            "ivb", "iv",
            "V", "Vb"
        ],
        "i": [
            "ivb", "iv",
            "Vb", "V",
            "ib", "i"
        ],
        "ib": [
            "iv", "ivb",
            "V", "Vb",
            "i", "ib"
        ],
        "iv": [
            "Vb", "V",
            "ib", "i",
            "ivb", "iv"
        ],
        "ivb": [
            "V", "Vb",
            "i", "ib",
            "iv", "ivb"
        ],
        "V": [
            "ib", "i",
            "ivb", "iv",
            "Vb", "V"
        ],
        "Vb": [
            "i", "ib",
            "iv", "ivb",
            "V", "Vb"
        ]
    },
} // Complete

const PRIMARY_ABC: any = {
    COMMON_MAJOR: {
        start: [
            "I", "Ib", "Ic",
            "IVc", "IVb", "IV",
            "V", "Vb", "Vc"
        ],
        "I": [
            "IVb", "IV",
            "Vb", "V",
            "Ib", "I"
        ],
        "Ib": [
            "IV", "IVb",
            "V", "Vb",
            "I", "Ib"
        ],
        "IV": [
            "Vb", "V",
            "Ib", "I",
            "IVb", "IV"
        ],
        "IVb": [
            "V", "Vb",
            "I", "Ib",
            "IV", "IVb"
        ],
        "V": [
            "Ib", "I",
            "IVb", "IV",
            "Vb", "V"]
        ,
        "Vb": [
            "I", "Ib",
            "IV", "IVb",
            "V", "Vb"
        ],
        "Vc": [

        ]
    },
    COMMON_MINOR: {
        start: [
            "i", "ib",
            "ivb", "iv",
            "V", "Vb"
        ],
        "i": [
            "ivb", "iv",
            "Vb", "V",
            "ib", "i"
        ],
        "ib": [
            "iv", "ivb",
            "V", "Vb",
            "i", "ib"
        ],
        "iv": [
            "Vb", "V",
            "ib", "i",
            "ivb", "iv"
        ],
        "ivb": [
            "V", "Vb",
            "i", "ib",
            "iv", "ivb"
        ],
        "V": [
            "ib", "i",
            "ivb", "iv",
            "Vb", "V"
        ],
        "Vb": [
            "i", "ib",
            "iv", "ivb",
            "V", "Vb"
        ]
    },
}
