import{a as e,b as n}from"./chunk-RR3YIVG4.js";import{e as i}from"./chunk-FAF55DAL.js";var t,r,a,o=i(()=>{n();t="meshUVSpaceRendererFinaliserVertexShader",r=`attribute position: vec3f;attribute uv: vec2f;uniform worldViewProjection: mat4x4f;varying vUV: vec2f;@vertex
fn main(input : VertexInputs)->FragmentInputs {vertexOutputs.position=uniforms.worldViewProjection* vec4f(input.position,1.0);vertexOutputs.positionvUV=input.uv;}
`;e.ShadersStoreWGSL[t]||(e.ShadersStoreWGSL[t]=r);a={name:t,shader:r}});export{a,o as b};
