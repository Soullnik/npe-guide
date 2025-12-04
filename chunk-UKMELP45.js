import{a as s}from"./chunk-SZKSMILK.js";import{a as e,b as n}from"./chunk-RR3YIVG4.js";import{e as t}from"./chunk-FAF55DAL.js";var o,u,i=t(()=>{"use strict";n();o="kernelBlurVertex",u="vertexOutputs.sampleCoord{X}=vertexOutputs.sampleCenter+uniforms.delta*KERNEL_OFFSET{X};";e.IncludesShadersStoreWGSL[o]||(e.IncludesShadersStoreWGSL[o]=u)});var r,a,f,d=t(()=>{n();s();i();r="kernelBlurVertexShader",a=`attribute position: vec2f;uniform delta: vec2f;varying sampleCenter: vec2f;
#include<kernelBlurVaryingDeclaration>[0..varyingCount]
#define CUSTOM_VERTEX_DEFINITIONS
@vertex
fn main(input : VertexInputs)->FragmentInputs {const madd: vec2f= vec2f(0.5,0.5);
#define CUSTOM_VERTEX_MAIN_BEGIN
vertexOutputs.sampleCenter=(input.position*madd+madd);
#include<kernelBlurVertex>[0..varyingCount]
vertexOutputs.position= vec4f(input.position,0.0,1.0);
#define CUSTOM_VERTEX_MAIN_END
}`;e.ShadersStoreWGSL[r]||(e.ShadersStoreWGSL[r]=a);f={name:r,shader:a}});export{f as a,d as b};
