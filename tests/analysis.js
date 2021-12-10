import fs from "fs";

const dict = {
    COMMON: {
        MAJOR: {},
        MINOR: {}
    },
    SPECIFIC: {
        I: {},
        ii: {},
        iii: {},
        IV: {},
        V: {},
        vi: {},
        i: {},
        III: {},
        iv: {},
        v: {},
        VI: {},
        VII: {}
    }
}

fs.writeFile("./tests/data/foo.json", JSON.stringify(Dict.FULL), err => {
    if (err) {
        console.error(err)
        return
    }
});