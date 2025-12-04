import{b as i}from"./chunk-3Q5BZMII.js";import{a as r,b as t}from"./chunk-RR3YIVG4.js";import{e as o}from"./chunk-FAF55DAL.js";var e,a,m,n=o(()=>{t();i();e="grainPixelShader",a=`#include<helperFunctions>
uniform sampler2D textureSampler; 
uniform float intensity;uniform float animatedSeed;varying vec2 vUV;
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void)
{gl_FragColor=texture2D(textureSampler,vUV);vec2 seed=vUV*(animatedSeed);float grain=dither(seed,intensity);float lum=getLuminance(gl_FragColor.rgb);float grainAmount=(cos(-PI+(lum*PI*2.))+1.)/2.;gl_FragColor.rgb+=grain*grainAmount;gl_FragColor.rgb=max(gl_FragColor.rgb,0.0);}`;r.ShadersStore[e]||(r.ShadersStore[e]=a);m={name:e,shader:a}});export{m as a,n as b};
