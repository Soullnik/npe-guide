import{a as e,b as r}from"./chunk-RR3YIVG4.js";import{e as o}from"./chunk-FAF55DAL.js";var t,n,s=o(()=>{"use strict";r();t="logDepthVertex",n=`#ifdef LOGARITHMICDEPTH
vFragmentDepth=1.0+gl_Position.w;gl_Position.z=log2(max(0.000001,vFragmentDepth))*logarithmicDepthConstant;
#endif
`;e.IncludesShadersStore[t]||(e.IncludesShadersStore[t]=n)});export{s as a};
