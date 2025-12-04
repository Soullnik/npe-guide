import{a,b as c}from"./chunk-ZLUVLGHH.js";import{a as l}from"./chunk-NOKOI7UI.js";import{b as t}from"./chunk-3Q5BZMII.js";import{a as r,b as o}from"./chunk-RR3YIVG4.js";import{e as n}from"./chunk-FAF55DAL.js";var i,e,f,d=n(()=>{o();t();a();l();c();i="hdrFilteringPixelShader",e=`#include<helperFunctions>
#include<importanceSampling>
#include<pbrBRDFFunctions>
#include<hdrFilteringFunctions>
uniform float alphaG;uniform samplerCube inputTexture;uniform vec2 vFilteringInfo;uniform float hdrScale;varying vec3 direction;void main() {vec3 color=radiance(alphaG,inputTexture,direction,vFilteringInfo);gl_FragColor=vec4(color*hdrScale,1.0);}`;r.ShadersStore[i]||(r.ShadersStore[i]=e);f={name:i,shader:e}});export{f as a,d as b};
