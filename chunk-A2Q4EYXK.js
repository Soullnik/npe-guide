import{a as e,b as n}from"./chunk-RR3YIVG4.js";import{e as o}from"./chunk-FAF55DAL.js";var r,f,s=o(()=>{"use strict";n();r="fresnelFunction",f=`#ifdef FRESNEL
fn computeFresnelTerm(viewDirection: vec3f,worldNormal: vec3f,bias: f32,power: f32)->f32
{let fresnelTerm: f32=pow(bias+abs(dot(viewDirection,worldNormal)),power);return clamp(fresnelTerm,0.,1.);}
#endif
`;e.IncludesShadersStoreWGSL[r]||(e.IncludesShadersStoreWGSL[r]=f)});export{s as a};
