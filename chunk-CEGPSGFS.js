import{a as d}from"./chunk-TKQC2XFE.js";import{a as m}from"./chunk-MFJUZDUZ.js";import{b as g}from"./chunk-ENWF5TL3.js";import{a as s}from"./chunk-PNTHVEFJ.js";import{b as l}from"./chunk-CGKO47GG.js";import{b as c}from"./chunk-F2BF3OFM.js";import{a as o,b as e}from"./chunk-RR3YIVG4.js";import{e as r}from"./chunk-FAF55DAL.js";var i,p,n=r(()=>{"use strict";e();d();m();i="gaussianSplattingFragmentDeclaration",p=`vec4 gaussianColor(vec4 inColor)
{float A=-dot(vPosition,vPosition);if (A<-4.0) discard;float B=exp(A)*inColor.a;
#include<logDepthFragment>
vec3 color=inColor.rgb;
#ifdef FOG
#include<fogFragment>
#endif
return vec4(color,B);}
`;o.IncludesShadersStore[i]||(o.IncludesShadersStore[i]=p)});var a,t,y,S=r(()=>{e();l();s();g();n();c();a="gaussianSplattingPixelShader",t=`#include<clipPlaneFragmentDeclaration>
#include<logDepthDeclaration>
#include<fogFragmentDeclaration>
varying vec4 vColor;varying vec2 vPosition;
#include<gaussianSplattingFragmentDeclaration>
void main () { 
#include<clipPlaneFragment>
gl_FragColor=gaussianColor(vColor);}
`;o.ShadersStore[a]||(o.ShadersStore[a]=t);y={name:a,shader:t}});export{y as a,S as b};
