import{a}from"./chunk-WNUYWNJD.js";import{b as t}from"./chunk-MXI7UYZS.js";import{b as d}from"./chunk-23BPZRIH.js";import{b as f}from"./chunk-H2WJWNOP.js";import{a as e,b as i}from"./chunk-RR3YIVG4.js";import{e as o}from"./chunk-FAF55DAL.js";var n,r,N,l=o(()=>{i();t();d();f();a();n="colorPixelShader",r=`#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
#define VERTEXCOLOR
varying vColor: vec4f;
#else
uniform color: vec4f;
#endif
#include<clipPlaneFragmentDeclaration>
#include<fogFragmentDeclaration>
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
fragmentOutputs.color=input.vColor;
#else
fragmentOutputs.color=uniforms.color;
#endif
#include<fogFragment>(color,fragmentOutputs.color)
#define CUSTOM_FRAGMENT_MAIN_END
}`;e.ShadersStoreWGSL[n]||(e.ShadersStoreWGSL[n]=r);N={name:n,shader:r}});export{N as a,l as b};
