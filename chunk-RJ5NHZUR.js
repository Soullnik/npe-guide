import{a as l}from"./chunk-TKQC2XFE.js";import{a as t}from"./chunk-PNTHVEFJ.js";import{b as a}from"./chunk-CGKO47GG.js";import{b as d}from"./chunk-F2BF3OFM.js";import{a as e,b as o}from"./chunk-RR3YIVG4.js";import{e as n}from"./chunk-FAF55DAL.js";var i,r,_,f=n(()=>{o();a();t();d();l();i="outlinePixelShader",r=`#ifdef LOGARITHMICDEPTH
#extension GL_EXT_frag_depth : enable
#endif
uniform vec4 color;
#ifdef ALPHATEST
varying vec2 vUV;uniform sampler2D diffuseSampler;
#endif
#include<clipPlaneFragmentDeclaration>
#include<logDepthDeclaration>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
#ifdef ALPHATEST
if (texture2D(diffuseSampler,vUV).a<0.4)
discard;
#endif
#include<logDepthFragment>
gl_FragColor=color;
#define CUSTOM_FRAGMENT_MAIN_END
}`;e.ShadersStore[i]||(e.ShadersStore[i]=r);_={name:i,shader:r}});export{_ as a,f as b};
