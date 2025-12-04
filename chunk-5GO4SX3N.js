import{a as e,b as i}from"./chunk-RR3YIVG4.js";import{e as n}from"./chunk-FAF55DAL.js";var d,r,t=n(()=>{"use strict";i();d="bumpVertexDeclaration",r=`#if defined(BUMP) || defined(PARALLAX) || defined(CLEARCOAT_BUMP) || defined(ANISOTROPIC)
#if defined(TANGENT) && defined(NORMAL) 
varying mat3 vTBN;
#endif
#endif
`;e.IncludesShadersStore[d]||(e.IncludesShadersStore[d]=r)});export{t as a};
