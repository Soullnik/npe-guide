import{a as o,b as f}from"./chunk-RR3YIVG4.js";import{e as r}from"./chunk-FAF55DAL.js";var e,t,a=r(()=>{"use strict";f();e="fogFragment",t=`#ifdef FOG
float fog=CalcFogFactor();
#ifdef PBR
fog=toLinearSpace(fog);
#endif
color.rgb=mix(vFogColor,color.rgb,fog);
#endif
`;o.IncludesShadersStore[e]||(o.IncludesShadersStore[e]=t)});export{a};
