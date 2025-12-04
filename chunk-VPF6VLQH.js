import{b as a}from"./chunk-3Q5BZMII.js";import{a as e,b as d}from"./chunk-RR3YIVG4.js";import{e as t}from"./chunk-FAF55DAL.js";var r,o,m,i=t(()=>{d();a();r="rgbdDecodePixelShader",o=`varying vec2 vUV;uniform sampler2D textureSampler;
#include<helperFunctions>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) 
{gl_FragColor=vec4(fromRGBD(texture2D(textureSampler,vUV)),1.0);}`;e.ShadersStore[r]||(e.ShadersStore[r]=o);m={name:r,shader:o}});export{m as a,i as b};
