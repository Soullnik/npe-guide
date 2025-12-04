import{a as e,b as i}from"./chunk-RR3YIVG4.js";import{e as n}from"./chunk-FAF55DAL.js";var d,r,f=n(()=>{"use strict";i();d="bumpVertexDeclaration",r=`#if defined(BUMP) || defined(PARALLAX) || defined(CLEARCOAT_BUMP) || defined(ANISOTROPIC)
#if defined(TANGENT) && defined(NORMAL) 
varying vTBN0: vec3f;varying vTBN1: vec3f;varying vTBN2: vec3f;
#endif
#endif
`;e.IncludesShadersStoreWGSL[d]||(e.IncludesShadersStoreWGSL[d]=r)});export{f as a};
