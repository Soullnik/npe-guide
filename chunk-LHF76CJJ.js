import{a as t,b as o}from"./chunk-RR3YIVG4.js";import{e as r}from"./chunk-FAF55DAL.js";var e,s,n=r(()=>{"use strict";o();e="logDepthVertex",s=`#ifdef LOGARITHMICDEPTH
vertexOutputs.vFragmentDepth=1.0+vertexOutputs.position.w;vertexOutputs.position.z=log2(max(0.000001,vertexOutputs.vFragmentDepth))*uniforms.logarithmicDepthConstant;
#endif
`;t.IncludesShadersStoreWGSL[e]||(t.IncludesShadersStoreWGSL[e]=s)});export{n as a};
