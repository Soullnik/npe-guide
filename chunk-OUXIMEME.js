import{a,b as c}from"./chunk-CUJCT6RP.js";import{a as u}from"./chunk-DONP4KGP.js";import{b as o}from"./chunk-HFHHSAGS.js";import{a as r,b as t}from"./chunk-RR3YIVG4.js";import{e as n}from"./chunk-FAF55DAL.js";var e,i,S,p=n(()=>{t();o();a();u();c();e="hdrFilteringPixelShader",i=`#include<helperFunctions>
#include<importanceSampling>
#include<pbrBRDFFunctions>
#include<hdrFilteringFunctions>
uniform alphaG: f32;var inputTextureSampler: sampler;var inputTexture: texture_cube<f32>;uniform vFilteringInfo: vec2f;uniform hdrScale: f32;varying direction: vec3f;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var color: vec3f=radiance(uniforms.alphaG,inputTexture,inputTextureSampler,input.direction,uniforms.vFilteringInfo);fragmentOutputs.color= vec4f(color*uniforms.hdrScale,1.0);}`;r.ShadersStoreWGSL[e]||(r.ShadersStoreWGSL[e]=i);S={name:e,shader:i}});export{S as a,p as b};
