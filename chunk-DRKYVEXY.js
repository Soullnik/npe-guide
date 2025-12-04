import{a as o,b as i}from"./chunk-RR3YIVG4.js";import{e as a}from"./chunk-FAF55DAL.js";var r,e,d,l=a(()=>{i();r="oitBackBlendPixelShader",e=`precision highp float;uniform sampler2D uBackColor;void main() {glFragColor=texelFetch(uBackColor,ivec2(gl_FragCoord.xy),0);if (glFragColor.a==0.0) { 
discard;}}`;o.ShadersStore[r]||(o.ShadersStore[r]=e);d={name:r,shader:e}});export{d as a,l as b};
