import{a as e,b as n}from"./chunk-RR3YIVG4.js";import{e as a}from"./chunk-FAF55DAL.js";var t,r,c,m=a(()=>{n();t="highlightsPixelShader",r=`varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;const RGBLuminanceCoefficients: vec3f= vec3f(0.2126,0.7152,0.0722);
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var tex: vec4f=textureSample(textureSampler,textureSamplerSampler,input.vUV);var c: vec3f=tex.rgb;var luma: f32=dot(c.rgb,RGBLuminanceCoefficients);fragmentOutputs.color= vec4f(pow(c, vec3f(25.0-luma*15.0)),tex.a); }`;e.ShadersStoreWGSL[t]||(e.ShadersStoreWGSL[t]=r);c={name:t,shader:r}});export{c as a,m as b};
