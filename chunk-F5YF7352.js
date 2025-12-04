import{a as e,b as t}from"./chunk-RR3YIVG4.js";import{e as n}from"./chunk-FAF55DAL.js";var o,r,c=n(()=>{"use strict";t();o="sceneUboDeclaration",r=`struct Scene {viewProjection : mat4x4<f32>,
#ifdef MULTIVIEW
viewProjectionR : mat4x4<f32>,
#endif 
view : mat4x4<f32>,
projection : mat4x4<f32>,
vEyePosition : vec4<f32>,};
#define SCENE_UBO
var<uniform> scene : Scene;
`;e.IncludesShadersStoreWGSL[o]||(e.IncludesShadersStoreWGSL[o]=r)});export{c as a};
