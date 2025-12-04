import{a as d}from"./chunk-TKQC2XFE.js";import{a}from"./chunk-PNTHVEFJ.js";import{b as l}from"./chunk-CGKO47GG.js";import{b as t}from"./chunk-F2BF3OFM.js";import{a as e,b as n}from"./chunk-RR3YIVG4.js";import{e as r}from"./chunk-FAF55DAL.js";var i,o,T,c=r(()=>{n();l();a();d();t();i="linePixelShader",o=`#include<clipPlaneFragmentDeclaration>
uniform vec4 color;
#ifdef LOGARITHMICDEPTH
#extension GL_EXT_frag_depth : enable
#endif
#include<logDepthDeclaration>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<logDepthFragment>
#include<clipPlaneFragment>
gl_FragColor=color;
#define CUSTOM_FRAGMENT_MAIN_END
}`;e.ShadersStore[i]||(e.ShadersStore[i]=o);T={name:i,shader:o}});export{T as a,c as b};
