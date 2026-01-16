import{a as m}from"./chunk-UIEDLGK2.js";import{b as a}from"./chunk-MXI7UYZS.js";import{b as l}from"./chunk-H2WJWNOP.js";import{a as o}from"./chunk-UTVAPBNU.js";import{a as e,b as i}from"./chunk-RR3YIVG4.js";import{e as t}from"./chunk-FAF55DAL.js";var n,r,s,c=t(()=>{i();a();o();m();l();n="linePixelShader",r=`#include<clipPlaneFragmentDeclaration>
uniform color: vec4f;
#include<logDepthDeclaration>
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<logDepthFragment>
#include<clipPlaneFragment>
fragmentOutputs.color=uniforms.color;
#define CUSTOM_FRAGMENT_MAIN_END
}`;e.ShadersStoreWGSL[n]||(e.ShadersStoreWGSL[n]=r);s={name:n,shader:r}});export{s as a,c as b};
