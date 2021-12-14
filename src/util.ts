import Event from "./event.js"

namespace Util {
    export type Bar = Event[];
    export interface Dictionary {
        start: {
            major: string[];
            minor: string[];
        };
        common: {
            major: any;
            minor: any;
        };
        specific?: any;
    }
    export type EventType = "normal" | "cadence" | "end";
    export type Inversion = 0 | 1 | 2 | 3;
    export const INVERSIONS: Util.Inversion[] = [0, 1, 2, 3];
    export type Modifier = "" | "7" | "o7";
    export type Part = "s" | "a" | "t" | "b";
    export const PARTS: Part[] = ["s", "a", "t", "b"];

    export interface Time {
        barIndex: number;
        eventIndex: number;
    }
}

export default Util;
