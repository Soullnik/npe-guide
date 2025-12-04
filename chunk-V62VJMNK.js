import{b as o}from"./chunk-R4MD35ZT.js";import{b as a}from"./chunk-NAYG47SM.js";import{b as n}from"./chunk-3Q5BZMII.js";import{a as e,b as t}from"./chunk-RR3YIVG4.js";import{e as s}from"./chunk-FAF55DAL.js";var r,i,m,l=s(()=>{t();o();n();a();r="imageProcessingPixelShader",i=`varying vec2 vUV;uniform sampler2D textureSampler;
#include<imageProcessingDeclaration>
#include<helperFunctions>
#include<imageProcessingFunctions>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void)
{vec4 result=texture2D(textureSampler,vUV);result.rgb=max(result.rgb,vec3(0.));
#ifdef IMAGEPROCESSING
#ifndef FROMLINEARSPACE
result.rgb=toLinearSpace(result.rgb);
#endif
result=applyImageProcessing(result);
#else
#ifdef FROMLINEARSPACE
result=applyImageProcessing(result);
#endif
#endif
gl_FragColor=result;}`;e.ShadersStore[r]||(e.ShadersStore[r]=i);m={name:r,shader:i}});export{m as a,l as b};
