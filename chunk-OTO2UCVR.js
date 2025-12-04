import{b as m}from"./chunk-HFHHSAGS.js";import{a as e,b as S}from"./chunk-RR3YIVG4.js";import{e as a}from"./chunk-FAF55DAL.js";var r,t,u,n=a(()=>{S();m();r="rgbdDecodePixelShader",t=`varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;
#include<helperFunctions>
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {fragmentOutputs.color=vec4f(fromRGBD(textureSample(textureSampler,textureSamplerSampler,input.vUV)),1.0);}`;e.ShadersStoreWGSL[r]||(e.ShadersStoreWGSL[r]=t);u={name:r,shader:t}});export{u as a,n as b};
