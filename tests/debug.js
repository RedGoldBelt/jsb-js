import * as JSB from '../dist/index.js';

console.time('Parsing');

const DEBUG = new JSB.Piece();
DEBUG.cache = [[JSB.Event.empty(), JSB.Event.empty()]];

console.timeEnd('Parsing');

console.time('Harmonisation');

console.log(DEBUG.harmonise().string());

console.timeEnd('Harmonisation');
