import{a as e,b as S}from"./chunk-RR3YIVG4.js";import{e as a}from"./chunk-FAF55DAL.js";var r,t,n,p=a(()=>{S();r="passPixelShader",t=`varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {fragmentOutputs.color=textureSample(textureSampler,textureSamplerSampler,input.vUV);}`;e.ShadersStoreWGSL[r]||(e.ShadersStoreWGSL[r]=t);n={name:r,shader:t}});export{n as a,p as b};
