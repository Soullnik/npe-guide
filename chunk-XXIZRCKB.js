import{a as e,b as n}from"./chunk-RR3YIVG4.js";import{e as a}from"./chunk-FAF55DAL.js";var r,t,m,l=a(()=>{n();r="blackAndWhitePixelShader",t=`varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;uniform degree: f32;
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var color: vec3f=textureSample(textureSampler,textureSamplerSampler,input.vUV).rgb;var luminance: f32=dot(color, vec3f(0.3,0.59,0.11)); 
var blackAndWhite: vec3f= vec3f(luminance,luminance,luminance);fragmentOutputs.color= vec4f(color-((color-blackAndWhite)*uniforms.degree),1.0);}`;e.ShadersStoreWGSL[r]||(e.ShadersStoreWGSL[r]=t);m={name:r,shader:t}});export{m as a,l as b};
