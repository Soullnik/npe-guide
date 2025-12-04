import{a as d,b as a}from"./chunk-ZLUVLGHH.js";import{a as c}from"./chunk-NOKOI7UI.js";import{b as t}from"./chunk-3Q5BZMII.js";import{a as e,b as o}from"./chunk-RR3YIVG4.js";import{e as n}from"./chunk-FAF55DAL.js";var r,i,h,l=n(()=>{o();t();d();c();a();r="hdrIrradianceFilteringPixelShader",i=`#include<helperFunctions>
#include<importanceSampling>
#include<pbrBRDFFunctions>
#include<hdrFilteringFunctions>
uniform samplerCube inputTexture;
#ifdef IBL_CDF_FILTERING
uniform sampler2D icdfTexture;
#endif
uniform vec2 vFilteringInfo;uniform float hdrScale;varying vec3 direction;void main() {vec3 color=irradiance(inputTexture,direction,vFilteringInfo,0.0,vec3(1.0),direction
#ifdef IBL_CDF_FILTERING
,icdfTexture
#endif
);gl_FragColor=vec4(color*hdrScale,1.0);}`;e.ShadersStore[r]||(e.ShadersStore[r]=i);h={name:r,shader:i}});export{h as a,l as b};
