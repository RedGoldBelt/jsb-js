(()=>{"use strict";var t={590:(t,i,e)=>{e.d(i,{Z:()=>a});var s=e(799),r=e(345),n=e(93);class a{constructor(t,i,e,s){this.base=t,this.alteration=i,this.inversion=e,this.relativeKey=s}static parse(t){const i=t.match(/^((b|#|)(III|iii|VII|vii|II|ii|IV|iv|VI|vi|I|i|V|v))(o7|7|)([a-d])?(\/((b|#|)(III|iii|VII|vii|II|ii|IV|iv|VI|vi|I|i|V|v)))?$/);if(null===i)throw`Could not parse chord '${t}'`;return new a(r.Z.parse(i[1]),i[4],i[5]?a.INVERSIONS.indexOf(i[5]):0,i[6]?r.Z.parse(i[7]):r.Z.parse("I"))}resolve(t){if(null===this.base)throw"Cannot resolve chord with base 'null'";this.relativeKey&&(t=new s.Z(t.degree(this.relativeKey.getDegree()),this.relativeKey.getTonality()));const i=t.degree(this.base.getDegree()).alterAccidental(this.base.getAccidental()).semitones()-t.degree(0).semitones(),e=t.degree(this.base.getDegree()+2,i+(this.base.getTonality()?4:3));let r,a;switch(this.alteration){case"":r=t.degree(this.base.getDegree()+4);break;case"o7":r=t.degree(this.base.getDegree()+4,i+6),a=t.degree(this.base.getDegree()+6,i+9);break;case"7":r=t.degree(this.base.getDegree()+4),a=t.degree(this.base.getDegree()+6)}return new n.Z(t.degree(this.base.getDegree()).alterAccidental(this.base.getAccidental()),e,r,a,this.inversion)}progression(t){var i,e;const s=null===(i=t.SPECIFIC)||void 0===i?void 0:i[this.relativeKey.string()][this.toStringStem()],r=null==s?void 0:s.map(a.parse),n=(this.relativeKey.getTonality()?t.COMMON.MAJOR:t.COMMON.MINOR)[this.toStringStem()].map((t=>{const i=a.parse(t);return i.relativeKey=this.relativeKey,i}));return null!==(e=null==r?void 0:r.concat(n))&&void 0!==e?e:n}getInversion(){return this.inversion}setInversion(t){return this.inversion=t,this}toStringStem(){return this.base?this.base.string()+this.alteration+(this.inversion?a.INVERSIONS[this.inversion]:""):"start"}string(){let t=this.toStringStem();return 0===this.relativeKey.getDegree()&&0===this.relativeKey.getAccidental()||(t+="/"+this.relativeKey.string()),t}}a.INVERSIONS=["a","b","c","d"]},781:(t,i,e)=>{var s;e.d(i,{Z:()=>r}),function(t){t.FULL={COMMON:{MAJOR:{start:["I","V","IV","ii","vi","iii"],I:["viib","iiic","iiib","iii","vic","vib","vi","ii7d","ii7c","ii7b","ii7","iic","iib","ii","IVc","IVb","IV","V7d","V7c","V7b","V7","Vc","Vb","V","Ic","Ib","I"],Ib:["IV","ii7b","ii7","iib","ii","V7d","V7c","Vc","vi","Ic","I"],Ic:["V7","V"],ii:["Ic","V","vi","iii","IV"],iib:["Ic","V"],iic:["iiib"],ii7:["Ic","V"],ii7b:["Ic","V"],ii7c:[],ii7d:["Vb"],iii:["viib","vi","IV","ii","vi"],iiib:["vi"],iiic:[],IV:["vi","vii","iii","Ic","I","V","ii"],IVb:["vii","Ic","I"],IVc:[],V:["iiic","iiib","iii","vi","iic","iib","ii","IV","Ic","Ib","I","Vb"],Vb:["vi","I"],Vc:["Ib","I"],V7:["vi","I"],V7b:["iiib","iii","vi","I"],V7c:["Ib","I"],V7d:["iii","Ib"],vi:["ii7d","ii7c","ii7b","ii7","iic","iib","ii","iiic","iiib","iii","Vb","V","IVb","IV","Ib"],vib:["ii"],vic:[],vii:["V/vi","iii","ii","V"],viib:["V/vi","I","iii"],viic:[],vii7:[],vii7b:[],vii7c:[],vii7d:[],viio7:[],viio7b:[],viio7c:[],viio7d:[]},MINOR:{start:["i","iv","V"],i:["VI","V7d","V7c","V7b","V7","Vc","Vb","V","#viib"],ib:["i"],ic:[],bII:[],bIIb:[],bIIc:[],ii:[],iib:[],iic:[],ii7:[],ii7b:[],ii7c:[],ii7d:[],III:["VI"],IIIb:[],IIIc:[],iv:["III","iv"],ivb:[],ivc:[],V:["bIIb","i"],Vb:["i"],Vc:["ib","i"],V7:["i"],V7b:["i"],V7c:["ib","i"],V7d:["ib"],VI:[],VIb:[],VIc:[],VII:[],VIIb:[],VIIc:[],"#vii":[],"#viib":["ib","i"],"#viic":[],"#viio7":["i"],"#viio7b":["ib","i"],"#viio7c":["ib"],"#viio7d":["ic"]}},SPECIFIC:{I:{start:[],I:["vii7/V"],Ib:[],Ic:[],ii:[],iib:[],iic:[],ii7:[],ii7b:[],ii7c:[],ii7d:[],iii:[],iiib:[],iiic:[],IV:[],IVb:[],IVc:[],V:["vii/V","V7d/V","V7c/V","V7b/V","V7/V"],Vb:[],Vc:[],V7:[],V7b:[],V7c:[],V7d:[],vi:["Vb/V"],vib:[],vic:[],vii:[],viib:[],viic:[],vii7:[],vii7b:[],vii7c:[],vii7d:[],viio7:[],viio7b:[],viio7c:[],viio7d:[]},II:{},III:{},IV:{start:["I","V","IV","ii","vi","iii"],I:[],Ib:[],Ic:[],ii:[],iib:[],iic:[],ii7:[],ii7b:[],ii7c:[],ii7d:[],iii:[],iiib:[],iiic:[],IV:[],IVb:[],IVc:[],V:[],Vb:[],Vc:[],V7:[],V7b:[],V7c:[],V7d:[],vi:[],vib:[],vic:[],vii:[],viib:[],viic:[],vii7:[],vii7b:[],vii7c:[],vii7d:[],viio7:[],viio7b:[],viio7c:[],viio7d:[]},V:{I:["V/I"],Ib:[],Ic:[],ii:[],iib:[],iic:[],ii7:[],ii7b:[],ii7c:[],ii7d:[],iii:[],iiib:[],iiic:[],IV:[],IVb:[],IVc:[],V:[],Vb:[],Vc:[],V7:[],V7b:["Ic/I","V/I"],V7c:["Vb/I"],V7d:[],vi:[],vib:[],vic:[],vii:[],viib:[],viic:[],vii7:["Ic/I","V/I"],vii7b:[],vii7c:[],vii7d:[],viio7:[],viio7b:[],viio7c:[],viio7d:[]},VI:{},VII:{},i:{},ii:{},iii:{},iv:{},v:{},vi:{},vii:{}}},t.PRIMARY_A={COMMON:{MAJOR:{start:["I","IV","V"],I:["IV","V","I"],IV:["V","I","IV"],V:["I","IV","V"]},MINOR:{start:["i","iv","V"],i:["iv","V","i"],iv:["V","i","iv"],V:["i","iv","V"]}}},t.PRIMARY_AB={COMMON:{MAJOR:{start:["I","Ib","IVb","IV","V","Vb"],I:["IVb","IV","Vb","V","Ib","I"],Ib:["IV","IVb","V","Vb","I","Ib"],IV:["Vb","V","Ib","I","IVb","IV"],IVb:["V","Vb","I","Ib","IV","IVb"],V:["Ib","I","IVb","IV","Vb","V"],Vb:["I","Ib","IV","IVb","V","Vb"]},MINOR:{start:["i","ib","ivb","iv","V","Vb"],i:["ivb","iv","Vb","V","ib","i"],ib:["iv","ivb","V","Vb","i","ib"],iv:["Vb","V","ib","i","ivb","iv"],ivb:["V","Vb","i","ib","iv","ivb"],V:["ib","i","ivb","iv","Vb","V"],Vb:["i","ib","iv","ivb","V","Vb"]}}},t.PRIMARY_ABC={COMMON:{MAJOR:{start:["I","Ib","Ic","IVc","IVb","IV","V","Vb","Vc"],I:["IVb","IV","Vb","V","Ib","I"],Ib:["IV","IVb","V","Vb","I","Ib"],IV:["Vb","V","Ib","I","IVb","IV"],IVb:["V","Vb","I","Ib","IV","IVb"],V:["Ib","I","IVb","IV","Vb","V"],Vb:["I","Ib","IV","IVb","V","Vb"],Vc:[]},MINOR:{start:["i","ib","ivb","iv","V","Vb"],i:["ivb","iv","Vb","V","ib","i"],ib:["iv","ivb","V","Vb","i","ib"],iv:["Vb","V","ib","i","ivb","iv"],ivb:["V","Vb","i","ib","iv","ivb"],V:["ib","i","ivb","iv","Vb","V"],Vb:["i","ib","iv","ivb","V","Vb"]}}}}(s||(s={}));const r=s},790:(t,i,e)=>{e.d(i,{Z:()=>s});class s{constructor(t,i,e,s,r){this.map=0,this.s=t,this.a=i,this.t=e,this.b=s,this.cadence=r}getS(){return this.s}setS(t){return this.s=t,this}getA(){return this.a}setA(t){return this.a=t,this}getT(){return this.t}setT(t){return this.t=t,this}getB(){return this.b}setB(t){return this.b=t,this}getPart(t){switch(t){case"s":return this.getS();case"a":return this.getA();case"t":return this.getT();case"b":return this.getB()}}setPart(t,i){switch(t){case"s":return this.setS(i);case"a":return this.setA(i);case"t":return this.setT(i);case"b":return this.setB(i)}}duration(){var t,i,e,s;return null!==(s=null!==(e=null!==(i=null!==(t=this.getS().duration())&&void 0!==t?t:this.getA().duration)&&void 0!==i?i:this.getT().duration)&&void 0!==e?e:this.getB().duration)&&void 0!==s?s:0}getChord(){return this.chord}setChord(t){return this.chord=t,this}isCadence(){return this.cadence}}},892:(t,i,e)=>{e.d(i,{Z:()=>r});var s=e(472);class r{constructor(t,i){this.notes=t,this.index=i}static parse(t){if(t.startsWith("(")&&t.endsWith(")")){const i=t.slice(1,-1).split(",").map((t=>s.Z.parse(t)));return new r(i,0)}return new r([s.Z.parse(t)],0)}static empty(){return new r([],0)}main(){return this.getNotes()[this.getIndex()]}at(t){return t<0&&(t=this.getNotes().length+t),this.getNotes()[t]}duration(){return this.getNotes().map((t=>t.getDuration())).reduce(((t,i)=>t+i))}getNotes(){return this.notes}setNotes(t){return this.notes=t,this}getIndex(){return this.index}setIndex(t){return this.index=t,this}string(){return this.getNotes().map((t=>t.string())).join(" ")}}},850:(t,i,e)=>{var s=e(590),r=e(781),n=e(790),a=e(892),o=e(799),h=e(472),c=e(345),u=e(423),v=e(411),b=e(93),g=e(237),l=e(740);g.Z,s.Z,r.Z,n.Z,a.Z,o.Z,h.Z,c.Z,u.Z,b.Z,v.Z,l.Z},799:(t,i,e)=>{e.d(i,{Z:()=>r});var s=e(237);class r{constructor(t,i){this.tone=t,this.tonality=i}static parse(t){const i=t.match(/^(C|D|E|F|G|A|B)(bb|x|b|#|) (major|minor)$/);if(null===i)throw`Could not parse key '${t}'`;return new r(s.Z.parse(i[1]+i[2]),"major"===i[3])}degree(t,i){t%=7,null!=i||(i=(this.getTonality()?[0,2,4,5,7,9,11]:[0,2,3,5,7,8,10])[t]);const e=new s.Z((this.getTone().getLetter()+t)%7,0);return e.setAccidental((i-e.semitones()+this.getTone().semitones()+18)%12-6),e}accidentals(){let t=2*this.getTone().getLetter()%7+7*this.getTone().getAccidental();return 3===this.getTone().getLetter()&&(t-=7),this.tonality||(t-=3),t}signature(){const t=this.accidentals();return[Math.floor((t+5)/7),Math.floor((t+3)/7),Math.floor((t+1)/7),Math.floor((t+6)/7),Math.floor((t+4)/7),Math.floor((t+2)/7),Math.floor(t/7)]}getTone(){return this.tone}setTone(t){return this.tone=t,this}getTonality(){return this.tonality}setTonality(t){return this.tonality=t,this}string(){return this.getTone().string()+" "+(this.getTonality()?"major":"minor")}}},472:(t,i,e)=>{e.d(i,{Z:()=>r});var s=e(411);class r{constructor(t,i){this.pitch=t,this.duration=i}static parse(t){const i=t.match(/^([A-G](bb|b|#|x|)[1-6])(_*)(\/*)(\.*)$/);if(null===i)throw`Could not parse note '${t}'`;return new r(s.Z.parse(i[1]),2**(i[3].length-i[4].length)*1.5**i[5].length)}getPitch(){return this.pitch}setPitch(t){return this.pitch=t,this}getDuration(){return this.duration}setDuration(t){return this.duration=t,this}string(){let t=this.getPitch().string();switch(this.getDuration()){case.25:t+="𝅘𝅥𝅯";break;case.5:t+="♪";break;case.75:t+="♪.";break;case 1:t+="♩";break;case 1.5:t+="♩.";break;case 2:t+="𝅗𝅥";break;case 3:t+="𝅗𝅥.";break;case 4:t+="𝅝";break;case 6:t+="𝅝."}return t}}},345:(t,i,e)=>{e.d(i,{Z:()=>r});var s=e(237);class r{constructor(t,i,e){this.accidental=t,this.degree=i,this.tonality=e}static parse(t){const i=t.match(/^(b|#|)(III|iii|VII|vii|II|ii|IV|iv|VI|vi|I|i|V|v)$/);if(null===i)throw`Could not parse numeral '${t}'`;return new r(s.Z.ACCIDENTALS.indexOf(i[1]),r.NUMERALS.indexOf(i[2].toLowerCase()),i[2]===i[2].toUpperCase())}getAccidental(){return this.accidental}setAccidental(t){return this.accidental=t,this}getDegree(){return this.degree}setDegree(t){return this.degree=t,this}getTonality(){return this.tonality}setTonality(t){return this.tonality=t,this}string(){return s.Z.ACCIDENTALS[this.accidental]+r.NUMERALS[this.degree][this.tonality?"toUpperCase":"toLowerCase"]()}}r.NUMERALS=["i","ii","iii","iv","v","vi","vii"]},423:(t,i,e)=>{e.d(i,{Z:()=>u});var s=e(590),r=e(781),n=e(790),a=e(892),o=e(799),h=e(345),c=e(411);class u{constructor(){this.input=[],this.output=[],this.time={bar:0,event:0},this.maxTime={bar:0,event:0},this.key=o.Z.parse("C major"),this.dictionary=r.Z.FULL}parse(t,i){var e,s,r,o;const h=t.split(/[[|\]]/).filter((t=>""!==t)).map((t=>t.split(" ").filter((t=>""!==t))));for(let t=0;t<h.length;++t){null!==(e=(r=this.getInput())[t])&&void 0!==e||(r[t]=[]);for(let e=0;e<h[t].length;++e){const r=h[t][e].endsWith("@");r&&(h[t][e]=h[t][e].slice(0,-1)),null!==(s=(o=this.getInput()[t])[e])&&void 0!==s||(o[e]=new n.Z(a.Z.empty(),a.Z.empty(),a.Z.empty(),a.Z.empty(),r)),this.getInput()[t][e][i]=a.Z.parse(h[t][e])}}return this}previousPreviousOutputEvent(){let{bar:t,event:i}=this.time;if(--i<0){if(--t<0)return;i=this.getOutput()[t].length-1}if(--i<0){if(--t<0)return;i=this.getOutput()[t].length-1}return this.getOutput()[t][i]}previousOutputEvent(){let{bar:t,event:i}=this.time;if(--i<0){if(--t<0)return;i=this.getOutput()[t].length-1}return this.getOutput()[t][i]}outputEvent(){return this.getOutput()[this.getTime().bar][this.getTime().event]}harmonise(){for(this.setOutput([]),this.setMaxTime({bar:0,event:0}),this.setTime({bar:0,event:0});this.getTime().bar!==this.getInput().length;this.step()){if(this.getTime().bar<0)throw"Failed to harmonise.";this.getTime().bar>this.getMaxTime().bar?this.setMaxTime(Object.assign({},this.getTime())):this.getTime().bar===this.getMaxTime().bar&&this.getTime().event>=this.getMaxTime().event&&(this.getMaxTime().event=this.getTime().event)}return this}step(){var t,i,e,r,o,u,v,b,g,l,I,V,d,p,m,T,f,O,E,Z;const A=this.getInput()[this.getTime().bar][this.getTime().event];null!==(t=(f=this.getOutput())[O=this.time.bar])&&void 0!==t||(f[O]=[]),null!==(i=(E=this.getOutput()[this.time.bar])[Z=this.time.event])&&void 0!==i||(E[Z]=new n.Z(a.Z.empty(),a.Z.empty(),a.Z.empty(),a.Z.empty(),A.isCadence()));const y=null!==(r=null===(e=this.previousOutputEvent())||void 0===e?void 0:e.getChord())&&void 0!==r?r:new s.Z(null,"",0,new h.Z(0,0,this.key.getTonality())),P=y.progression(this.dictionary).filter((t=>!this.outputEvent().isCadence()||["I","i","V"].includes(t.toStringStem())));for(;this.outputEvent().map<P.length;++this.outputEvent().map){const t=P[this.outputEvent().map],i=t.resolve(this.key),e={s:void 0!==A.getS().main(),a:void 0!==A.getA().main(),t:void 0!==A.getT().main(),b:void 0!==A.getB().main()};if(["s","a","t","b"].filter((t=>e[t])).map((t=>A.getPart(t).duration())).some(((t,i,e)=>t!==e[0])))throw"Not all parts have the same duration.";if(!e.s)throw"Soprano line is not defined.";this.outputEvent().setS(A.getS()),this.outputEvent().setA(A.getA()),this.outputEvent().setT(A.getT()),this.outputEvent().setB(A.getB());const s={a:null!==(u=null===(o=this.previousOutputEvent())||void 0===o?void 0:o.getA().at(-1).getPitch())&&void 0!==u?u:c.Z.parse("D4"),t:null!==(b=null===(v=this.previousOutputEvent())||void 0===v?void 0:v.getT().at(-1).getPitch())&&void 0!==b?b:c.Z.parse("B3"),b:null!==(l=null===(g=this.previousOutputEvent())||void 0===g?void 0:g.getB().at(-1).getPitch())&&void 0!==l?l:c.Z.parse("Eb3")};if(!e.b){const t=i.bass().near(s.b).filter((t=>t.semitones()>=28&&t.semitones()<=48&&t.semitones()<=this.outputEvent().getS().main().getPitch().semitones()-10))[0];this.outputEvent().setB(t.group(this.outputEvent().duration()))}if(i.excludes(null===(I=A.getS().main())||void 0===I?void 0:I.getPitch().getTone())||i.excludes(null===(V=A.getA().main())||void 0===V?void 0:V.getPitch().getTone())||i.excludes(null===(d=A.getT().main())||void 0===d?void 0:d.getPitch().getTone())||i.excludes(null===(p=A.getB().main())||void 0===p?void 0:p.getPitch().getTone()))continue;if(A.getB().main()&&!A.getB().main().getPitch().getTone().equals(i.bass()))continue;if(2===y.getInversion()&&(null===(T=null===(m=this.previousPreviousOutputEvent())||void 0===m?void 0:m.getChord())||void 0===T?void 0:T.string())===t.string())continue;const r=i.getSeventh()?[1,1,1,1]:[2,1,2,0];for(const t of["s","a","t","b"]){const e=[i.getRoot(),i.getThird(),i.getFifth(),i.getSeventh()].filter((t=>void 0!==t)).findIndex((i=>{var e;return i.equals(null===(e=this.outputEvent().getPart(t).main())||void 0===e?void 0:e.getPitch().getTone())}));-1!==e&&--r[e]}if(void 0===i.getSeventh()){if(0===r[0]&&(r[2]=1,0===r[2]))continue;0===r[2]&&(r[0]=1)}if(r.some((t=>t<0)))continue;let n;const a=r.map(((t,e)=>1===t?i.at(e):void 0)).filter((t=>void 0!==t));let h,f;if(e.a||e.t)e.a&&!e.t?(h=this.outputEvent().getA().main().getPitch(),n=1===a.length?[{a:h,t:f=a[0].near(s.t)[0],score:this.score(h,f)}]:[{a:h,t:f=a[0].near(s.t)[0],score:this.score(h,f)},{a:h,t:f=a[1].near(s.t)[0],score:this.score(h,f)}]):!e.a&&e.t?(f=this.outputEvent().getT().main().getPitch(),n=1===a.length?[{a:h=a[0].near(s.a)[0],t:f,score:this.score(h,f)}]:[{a:h=a[0].near(s.a)[0],t:f,score:this.score(h,f)},{a:h=a[1].near(s.a)[0],t:f,score:this.score(h,f)}]):n=[{a:h=this.outputEvent().getA().main().getPitch(),t:f=this.outputEvent().getT().main().getPitch(),score:this.score(h,f)}];else{let t=i.at(r.findIndex((t=>2===t)));switch(a.length){case 1:n=[{a:h=a[0].near(s.a)[0],t:f=t.near(s.t)[0],score:this.score(h,f)},{a:h=t.near(s.a)[0],t:f=a[0].near(s.t)[0],score:this.score(h,f)},{a:h=t.near(s.a)[0],t:f=t.near(s.t)[0],score:this.score(h,f)}].sort(((t,i)=>t.score-i.score));break;case 2:n=[{a:h=a[0].near(s.a)[0],t:f=a[1].near(s.t)[0],score:this.score(h,f)},{a:h=a[1].near(s.a)[0],t:f=a[0].near(s.t)[0],score:this.score(h,f)}].sort(((t,i)=>t.score-i.score));break;case 3:n=[{a:h=a[0].near(s.a)[0],t:f=a[1].near(s.t)[0],score:this.score(h,f)},{a:h=a[1].near(s.a)[0],t:f=a[0].near(s.t)[0],score:this.score(h,f)},{a:h=a[1].near(s.a)[0],t:f=a[2].near(s.t)[0],score:this.score(h,f)},{a:h=a[2].near(s.a)[0],t:f=a[1].near(s.t)[0],score:this.score(h,f)}].sort(((t,i)=>t.score-i.score))}}for(const i of n)if(i.score!==1/0&&(this.outputEvent().setA(i.a.group(this.outputEvent().duration())),this.outputEvent().setT(i.t.group(this.outputEvent().duration())),!(this.checkParallel("s","a")||this.checkParallel("s","t")||this.checkParallel("s","b")||this.checkParallel("a","t")||this.checkParallel("a","b")||this.checkParallel("t","b"))))return this.outputEvent().setChord(t),void(++this.getTime().event===this.getInput()[this.getTime().bar].length&&(this.getTime().event=0,++this.getTime().bar))}this.outputEvent().map=0,--this.getTime().event<0&&--this.getTime().bar>=0&&(this.getTime().event=this.getInput()[this.getTime().bar].length-1),this.getTime().bar>=0&&++this.outputEvent().map}score(t,i){var e,s,r,n;const a=this.outputEvent().getS().main().getPitch().semitones(),o=t.semitones(),h=i.semitones(),u=this.outputEvent().getB().main().getPitch().semitones(),v=null!==(s=null===(e=this.previousOutputEvent())||void 0===e?void 0:e.getA().at(-1).getPitch())&&void 0!==s?s:c.Z.parse("D4"),b=null!==(n=null===(r=this.previousOutputEvent())||void 0===r?void 0:r.getT().at(-1).getPitch())&&void 0!==n?n:c.Z.parse("B3"),g=Math.abs(o-v.semitones()),l=Math.abs(h-b.semitones());if(g>7||l>7||o>a||h>o||u>h||o>64||o<43||h<40||h>52)return 1/0;const I=a-o,V=o-h;return g+l+Math.sqrt((I*I+V*V)/2-(I+V)**2/4)}checkParallel(t,i){const e=this.previousOutputEvent();if(void 0===e)return!1;const s=e.getPart(t).at(-1).getPitch().semitones(),r=e.getPart(i).at(-1).getPitch().semitones(),n=this.outputEvent().getPart(t).at(0).getPitch().semitones(),a=this.outputEvent().getPart(i).at(0).getPitch().semitones(),o=(s-r)%12,h=(n-a)%12;return(0===o&&0===h||7===o&&7===h)&&s!==n&&r!==a}getInput(){return this.input}setInput(t){return this.input=t,this}getOutput(){return this.output}setOutput(t){return this.output=t,this}getTime(){return this.time}setTime(t){return this.time=t,this}getMaxTime(){return this.maxTime}setMaxTime(t){return this.maxTime=t,this}getKey(){return this.key}setKey(t){return this.key=t,this}getDictionary(){return this.dictionary}setDictionary(t){return this.dictionary=t,this}string(){return`[${this.getOutput().map((t=>t.map((t=>t.getS().string().padEnd(8))).join(" "))).join("|")}]\n[${this.getOutput().map((t=>t.map((t=>t.getA().string().padEnd(8))).join(" "))).join("|")}]\n[${this.getOutput().map((t=>t.map((t=>t.getT().string().padEnd(8))).join(" "))).join("|")}]\n[${this.getOutput().map((t=>t.map((t=>t.getB().string().padEnd(8))).join(" "))).join("|")}]\n[${this.getOutput().map((t=>t.map((t=>{var i;return null===(i=t.getChord())||void 0===i?void 0:i.string().padEnd(8)})).join(" "))).join("|")}]`}}},411:(t,i,e)=>{e.d(i,{Z:()=>a});var s=e(892),r=e(472),n=e(237);class a{constructor(t,i){this.tone=t,this.octave=i}static parse(t){const i=t.match(/^([A-G](bb|b|#|x|))([1-6])$/);if(null===i)throw`Could not parse pitch '${t}'`;return new a(n.Z.parse(i[1]),Number(i[3]))}semitones(){return this.getTone().semitones()+12*this.getOctave()}near(t){return[new a(t,this.getOctave()-1),new a(t,this.getOctave()),new a(t,this.getOctave()+1)].sort(((t,i)=>Math.abs(this.semitones()-t.semitones())-Math.abs(this.semitones()-i.semitones())))}getTone(){return this.tone}setTone(t){return this.tone=t,this}getOctave(){return this.octave}setOctave(t){return this.octave=t,this}string(){return this.getTone().string()+this.getOctave()}group(t){return new s.Z([new r.Z(this,t)],0)}}},93:(t,i,e)=>{e.d(i,{Z:()=>s});class s{constructor(t,i,e,s,r){this.root=t,this.third=i,this.fifth=e,this.seventh=s,this.inversion=r}at(t){switch(t){case 0:return this.root;case 1:return this.third;case 2:return this.fifth;case 3:return this.seventh}}bass(){return this.at(this.inversion)}excludes(t){var i,e,s,r;return void 0!==t&&!((null===(i=this.root)||void 0===i?void 0:i.equals(t))||(null===(e=this.third)||void 0===e?void 0:e.equals(t))||(null===(s=this.fifth)||void 0===s?void 0:s.equals(t))||(null===(r=this.seventh)||void 0===r?void 0:r.equals(t)))}getRoot(){return this.root}setRoot(t){return this.root=t,this}getThird(){return this.third}setThird(t){return this.third=t,this}getFifth(){return this.fifth}setFifth(t){return this.fifth=t,this}getSeventh(){return this.seventh}setSeventh(t){return this.seventh=t,this}string(){const t=[this.root,this.third,this.fifth,this.seventh].filter((t=>t)).map((t=>null==t?void 0:t.string()));return t[this.inversion]=`{${t[this.inversion]}}`,t.join(" ")}}},237:(t,i,e)=>{e.d(i,{Z:()=>r});var s=e(411);class r{constructor(t,i){this.letter=t,this.accidental=i}static parse(t){const i=t.match(/^([A-G])(bb|x|b|#|)$/);if(null===i)throw`Could not parse tone '${t}'`;return new r(r.LETTERS.indexOf(i[1]),r.ACCIDENTALS.indexOf(i[2]))}semitones(){return r.PITCHES[this.letter]+this.accidental}equals(t){return void 0!==t&&this.letter===t.letter&&this.accidental===t.accidental}near(t){return[new s.Z(this,t.getOctave()-1),new s.Z(this,t.getOctave()),new s.Z(this,t.getOctave()+1)].sort(((i,e)=>Math.abs(t.semitones()-i.semitones())-Math.abs(t.semitones()-e.semitones())))}getLetter(){return this.letter}setLetter(t){return this.letter=t,this}getAccidental(){return this.accidental}setAccidental(t){return t>=-2&&t<=2&&(this.accidental=t),this}alterAccidental(t){const i=this.accidental+t;return i>=-2&&i<=2&&(this.accidental=i),this}string(){return r.LETTERS[this.letter]+r.ACCIDENTALS[this.accidental]}}r.ACCIDENTALS=["","#","x"],r.ACCIDENTALS[-2]="bb",r.ACCIDENTALS[-1]="b",r.LETTERS=["C","D","E","F","G","A","B"],r.PITCHES=[0,2,4,5,7,9,11]},740:(t,i,e)=>{var s;e.d(i,{Z:()=>r}),function(t){t.Printable=class{}}(s||(s={}));const r=s}},i={};function e(s){var r=i[s];if(void 0!==r)return r.exports;var n=i[s]={exports:{}};return t[s](n,n.exports,e),n.exports}e.d=(t,i)=>{for(var s in i)e.o(i,s)&&!e.o(t,s)&&Object.defineProperty(t,s,{enumerable:!0,get:i[s]})},e.o=(t,i)=>Object.prototype.hasOwnProperty.call(t,i),e(590),e(781),e(790),e(892),e(850),e(799),e(472),e(345),e(423),e(411),e(93),e(237),e(740)})();