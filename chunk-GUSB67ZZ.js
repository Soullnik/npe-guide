import{a as c}from"./chunk-4ROQ5EEZ.js";import{a as s}from"./chunk-UHREBOBB.js";import{a as n}from"./chunk-XWI4LTJ3.js";import{a as d}from"./chunk-6R2MQ2L3.js";import{a as e,b as t}from"./chunk-RR3YIVG4.js";import{e as i}from"./chunk-FAF55DAL.js";var o,r,p,l=i(()=>{t();s();d();c();n();o="volumetricLightingRenderVolumeVertexShader",r=`#include<__decl__sceneVertex>
#include<__decl__meshVertex>
attribute vec3 position;varying vec4 vWorldPos;void main(void) {vec4 worldPos=world*vec4(position,1.0);vWorldPos=worldPos;gl_Position=viewProjection*worldPos;}
`;e.ShadersStore[o]||(e.ShadersStore[o]=r);p={name:o,shader:r}});l();export{p as volumetricLightingRenderVolumeVertexShader};
