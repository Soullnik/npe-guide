import{b as a}from"./chunk-3Q5BZMII.js";import{a as e,b as d}from"./chunk-RR3YIVG4.js";import{e as t}from"./chunk-FAF55DAL.js";var r,o,l,i=t(()=>{d();a();r="rgbdEncodePixelShader",o=`varying vec2 vUV;uniform sampler2D textureSampler;
#include<helperFunctions>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) 
{gl_FragColor=toRGBD(texture2D(textureSampler,vUV).rgb);}`;e.ShadersStore[r]||(e.ShadersStore[r]=o);l={name:r,shader:o}});export{l as a,i as b};
