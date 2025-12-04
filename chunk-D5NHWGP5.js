import{a as e,b as d}from"./chunk-RR3YIVG4.js";import{e as t}from"./chunk-FAF55DAL.js";var n,a,r=t(()=>{"use strict";d();n="bumpVertex",a=`#if defined(BUMP) || defined(PARALLAX) || defined(CLEARCOAT_BUMP) || defined(ANISOTROPIC)
#if defined(TANGENT) && defined(NORMAL)
vec3 tbnNormal=normalize(normalUpdated);vec3 tbnTangent=normalize(tangentUpdated.xyz);vec3 tbnBitangent=cross(tbnNormal,tbnTangent)*tangentUpdated.w;vTBN=mat3(finalWorld)*mat3(tbnTangent,tbnBitangent,tbnNormal);
#endif
#endif
`;e.IncludesShadersStore[n]||(e.IncludesShadersStore[n]=a)});export{r as a};
