import{b as l}from"./chunk-3Q5BZMII.js";import{a as r,b as a}from"./chunk-RR3YIVG4.js";import{e as t}from"./chunk-FAF55DAL.js";var e,o,h,i=t(()=>{a();l();e="extractHighlightsPixelShader",o=`#include<helperFunctions>
varying vec2 vUV;uniform sampler2D textureSampler;uniform float threshold;uniform float exposure;
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) 
{gl_FragColor=texture2D(textureSampler,vUV);float luma=dot(LuminanceEncodeApprox,gl_FragColor.rgb*exposure);gl_FragColor.rgb=step(threshold,luma)*gl_FragColor.rgb;}`;r.ShadersStore[e]||(r.ShadersStore[e]=o);h={name:e,shader:o}});export{h as a,i as b};
