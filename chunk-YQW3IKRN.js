import{a as s}from"./chunk-WXYTA4XG.js";import{a as n}from"./chunk-F5YF7352.js";import{a as e,b as i}from"./chunk-RR3YIVG4.js";import{e as r}from"./chunk-FAF55DAL.js";var t,o,u,d=r(()=>{i();n();s();t="volumetricLightingRenderVolumeVertexShader",o=`#include<sceneUboDeclaration>
#include<meshUboDeclaration>
attribute position : vec3f;varying vWorldPos: vec4f;@vertex
fn main(input : VertexInputs)->FragmentInputs {let worldPos=mesh.world*vec4f(vertexInputs.position,1.0);vertexOutputs.vWorldPos=worldPos;vertexOutputs.position=scene.viewProjection*worldPos;}
`;e.ShadersStoreWGSL[t]||(e.ShadersStoreWGSL[t]=o);u={name:t,shader:o}});d();export{u as volumetricLightingRenderVolumeVertexShaderWGSL};
