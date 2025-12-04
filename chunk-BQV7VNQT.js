import{a as d}from"./chunk-A3ERZO7R.js";import{a as e,b as n}from"./chunk-RR3YIVG4.js";import{e as t}from"./chunk-FAF55DAL.js";var o,l,a=t(()=>{"use strict";n();o="kernelBlurVertex",l="sampleCoord{X}=sampleCenter+delta*KERNEL_OFFSET{X};";e.IncludesShadersStore[o]||(e.IncludesShadersStore[o]=l)});var r,i,E,s=t(()=>{n();d();a();r="kernelBlurVertexShader",i=`attribute vec2 position;uniform vec2 delta;varying vec2 sampleCenter;
#include<kernelBlurVaryingDeclaration>[0..varyingCount]
const vec2 madd=vec2(0.5,0.5);
#define CUSTOM_VERTEX_DEFINITIONS
void main(void) {
#define CUSTOM_VERTEX_MAIN_BEGIN
sampleCenter=(position*madd+madd);
#include<kernelBlurVertex>[0..varyingCount]
gl_Position=vec4(position,0.0,1.0);
#define CUSTOM_VERTEX_MAIN_END
}`;e.ShadersStore[r]||(e.ShadersStore[r]=i);E={name:r,shader:i}});export{E as a,s as b};
