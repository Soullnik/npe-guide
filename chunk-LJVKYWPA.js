import{a as r,b as g}from"./chunk-RR3YIVG4.js";import{e as t}from"./chunk-FAF55DAL.js";var e,a,o,l=t(()=>{g();e="anaglyphPixelShader",a=`varying vec2 vUV;uniform sampler2D textureSampler;uniform sampler2D leftSampler;
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void)
{vec4 leftFrag=texture2D(leftSampler,vUV);leftFrag=vec4(1.0,leftFrag.g,leftFrag.b,1.0);vec4 rightFrag=texture2D(textureSampler,vUV);rightFrag=vec4(rightFrag.r,1.0,1.0,1.0);gl_FragColor=vec4(rightFrag.rgb*leftFrag.rgb,1.0);}`;r.ShadersStore[e]||(r.ShadersStore[e]=a);o={name:e,shader:a}});export{o as a,l as b};
