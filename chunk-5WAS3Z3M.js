import{a as e,b as r}from"./chunk-RR3YIVG4.js";import{e as t}from"./chunk-FAF55DAL.js";var o,s,d=t(()=>{"use strict";r();o="fogVertex",s=`#ifdef FOG
#ifdef SCENE_UBO
vertexOutputs.vFogDistance=(scene.view*worldPos).xyz;
#else
vertexOutputs.vFogDistance=(uniforms.view*worldPos).xyz;
#endif
#endif
`;e.IncludesShadersStoreWGSL[o]||(e.IncludesShadersStoreWGSL[o]=s)});export{d as a};
