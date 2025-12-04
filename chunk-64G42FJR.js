import{a as u}from"./chunk-BQE7GYLC.js";import{a as c}from"./chunk-IVHC7JH2.js";import{a as n,b as x}from"./chunk-JZRHVK4S.js";import{b as d}from"./chunk-7WAK3VD7.js";import{b as s}from"./chunk-O6SXCXKG.js";import{b as m}from"./chunk-EUALCU5W.js";import{b as p}from"./chunk-AEECYACG.js";import{b as a}from"./chunk-CFG3P2H7.js";import{b as l}from"./chunk-F6VQTDND.js";import{a as e,b as t}from"./chunk-RR3YIVG4.js";import{e as r}from"./chunk-FAF55DAL.js";var i,o,G,v=r(()=>{t();a();n();u();l();d();s();m();c();p();x();i="iblVoxelGridVertexShader",o=`attribute vec3 position;varying vec3 vNormalizedPosition;
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<instancesDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
uniform mat4 invWorldScale;uniform mat4 viewMatrix;void main(void) {vec3 positionUpdated=position;
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
vec4 worldPos=finalWorld*vec4(positionUpdated,1.0);gl_Position=viewMatrix*invWorldScale*worldPos;vNormalizedPosition.xyz=gl_Position.xyz*0.5+0.5;
#ifdef IS_NDC_HALF_ZRANGE
gl_Position.z=gl_Position.z*0.5+0.5;
#endif
}`;e.ShadersStore[i]||(e.ShadersStore[i]=o);G={name:i,shader:o}});export{G as a,v as b};
