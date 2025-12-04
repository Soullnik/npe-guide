import{a as p}from"./chunk-UIEDLGK2.js";import{a as m}from"./chunk-WNUYWNJD.js";import{b as g}from"./chunk-23BPZRIH.js";import{a as c}from"./chunk-UTVAPBNU.js";import{b as l}from"./chunk-MXI7UYZS.js";import{b as s}from"./chunk-H2WJWNOP.js";import{a as n,b as r}from"./chunk-RR3YIVG4.js";import{e}from"./chunk-FAF55DAL.js";var o,u,i=e(()=>{"use strict";r();p();m();o="gaussianSplattingFragmentDeclaration",u=`fn gaussianColor(inColor: vec4f,inPosition: vec2f)->vec4f
{var A : f32=-dot(inPosition,inPosition);if (A>-4.0)
{var B: f32=exp(A)*inColor.a;
#include<logDepthFragment>
var color: vec3f=inColor.rgb;
#ifdef FOG
#include<fogFragment>
#endif
return vec4f(color,B);} else {return vec4f(0.0);}}
`;n.IncludesShadersStoreWGSL[o]||(n.IncludesShadersStoreWGSL[o]=u)});var t,a,W,S=e(()=>{r();l();c();g();i();s();t="gaussianSplattingPixelShader",a=`#include<clipPlaneFragmentDeclaration>
#include<logDepthDeclaration>
#include<fogFragmentDeclaration>
varying vColor: vec4f;varying vPosition: vec2f;
#include<gaussianSplattingFragmentDeclaration>
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#include<clipPlaneFragment>
fragmentOutputs.color=gaussianColor(input.vColor,input.vPosition);}
`;n.ShadersStoreWGSL[t]||(n.ShadersStoreWGSL[t]=a);W={name:t,shader:a}});export{i as a,W as b,S as c};
