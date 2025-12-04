import{a as e,b as n}from"./chunk-RR3YIVG4.js";import{e as t}from"./chunk-FAF55DAL.js";var o,r,i=t(()=>{"use strict";n();o="sceneUboDeclaration",r=`layout(std140,column_major) uniform;uniform Scene {mat4 viewProjection;
#ifdef MULTIVIEW
mat4 viewProjectionR;
#endif 
mat4 view;mat4 projection;vec4 vEyePosition;};
`;e.IncludesShadersStore[o]||(e.IncludesShadersStore[o]=r)});export{i as a};
