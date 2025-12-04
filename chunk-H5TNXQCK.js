import{a as e,b as p}from"./chunk-RR3YIVG4.js";import{e as a}from"./chunk-FAF55DAL.js";var r,t,m,n=a(()=>{p();r="meshUVSpaceRendererPixelShader",t=`varying vDecalTC: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {if (input.vDecalTC.x<0. || input.vDecalTC.x>1. || input.vDecalTC.y<0. || input.vDecalTC.y>1.) {discard;}
fragmentOutputs.color=textureSample(textureSampler,textureSamplerSampler,input.vDecalTC);}
`;e.ShadersStoreWGSL[r]||(e.ShadersStoreWGSL[r]=t);m={name:r,shader:t}});export{m as a,n as b};
