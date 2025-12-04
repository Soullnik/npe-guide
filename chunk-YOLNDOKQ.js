import{a as o}from"./chunk-UIEDLGK2.js";import{a as l}from"./chunk-UTVAPBNU.js";import{b as n}from"./chunk-MXI7UYZS.js";import{b as f}from"./chunk-H2WJWNOP.js";import{a as e,b as a}from"./chunk-RR3YIVG4.js";import{e as i}from"./chunk-FAF55DAL.js";var r,t,s,m=i(()=>{a();n();l();f();o();r="outlinePixelShader",t=`uniform color: vec4f;
#ifdef ALPHATEST
varying vUV: vec2f;var diffuseSamplerSampler: sampler;var diffuseSampler: texture_2d<f32>;
#endif
#include<clipPlaneFragmentDeclaration>
#include<logDepthDeclaration>
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
#ifdef ALPHATEST
if (textureSample(diffuseSampler,diffuseSamplerSampler,fragmentInputs.vUV).a<0.4) {discard;}
#endif
#include<logDepthFragment>
fragmentOutputs.color=uniforms.color;
#define CUSTOM_FRAGMENT_MAIN_END
}`;e.ShadersStoreWGSL[r]||(e.ShadersStoreWGSL[r]=t);s={name:r,shader:t}});export{s as a,m as b};
