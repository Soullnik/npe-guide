import{a,b as t}from"./chunk-RR3YIVG4.js";import{e}from"./chunk-FAF55DAL.js";var r,o,n,d=e(()=>{t();r="shadowMapFragmentSoftTransparentShadow",o=`#if SM_SOFTTRANSPARENTSHADOW==1
if ((bayerDither8(floor(mod(gl_FragCoord.xy,8.0))))/64.0>=softTransparentShadowSM.x*alpha) discard;
#endif
`;a.IncludesShadersStore[r]||(a.IncludesShadersStore[r]=o);n={name:r,shader:o}});export{n as a,d as b};
