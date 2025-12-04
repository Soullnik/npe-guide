import{a as e,b as d}from"./chunk-RR3YIVG4.js";import{e as c}from"./chunk-FAF55DAL.js";var r,i,f,o=c(()=>{d();r="iblCdfxPixelShader",i=`precision highp sampler2D;
#define PI 3.1415927
varying vec2 vUV;uniform sampler2D cdfy;void main(void) {ivec2 cdfyRes=textureSize(cdfy,0);ivec2 currentPixel=ivec2(gl_FragCoord.xy);float cdfx=0.0;for (int x=1; x<=currentPixel.x; x++) {cdfx+=texelFetch(cdfy,ivec2(x-1,cdfyRes.y-1),0).x;}
gl_FragColor=vec4(vec3(cdfx),1.0);}`;e.ShadersStore[r]||(e.ShadersStore[r]=i);f={name:r,shader:i}});export{f as a,o as b};
