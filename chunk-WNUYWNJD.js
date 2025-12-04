import{a as o,b as f}from"./chunk-RR3YIVG4.js";import{e}from"./chunk-FAF55DAL.js";var r,a,c=e(()=>{"use strict";f();r="fogFragment",a=`#ifdef FOG
var fog: f32=CalcFogFactor();
#ifdef PBR
fog=toLinearSpace(fog);
#endif
color= vec4f(mix(uniforms.vFogColor,color.rgb,fog),color.a);
#endif
`;o.IncludesShadersStoreWGSL[r]||(o.IncludesShadersStoreWGSL[r]=a)});export{c as a};
