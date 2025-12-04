import{a as e,b as a}from"./chunk-RR3YIVG4.js";import{e as S}from"./chunk-FAF55DAL.js";var r,t,f,o=S(()=>{a();r="depthBoxBlurPixelShader",t=`varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;uniform screenSize: vec2f;
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var colorDepth: vec4f=vec4f(0.0);for (var x: i32=-OFFSET; x<=OFFSET; x++) {for (var y: i32=-OFFSET; y<=OFFSET; y++) {colorDepth+=textureSample(textureSampler,textureSamplerSampler,input.vUV+ vec2f(f32(x),f32(y))/uniforms.screenSize);}}
fragmentOutputs.color=(colorDepth/ f32((OFFSET*2+1)*(OFFSET*2+1)));}`;e.ShadersStoreWGSL[r]||(e.ShadersStoreWGSL[r]=t);f={name:r,shader:t}});export{f as a,o as b};
