import{a as f}from"./chunk-BQE7GYLC.js";import{a as m}from"./chunk-IVHC7JH2.js";import{a,b as u}from"./chunk-JZRHVK4S.js";import{b as s}from"./chunk-7WAK3VD7.js";import{b as c}from"./chunk-O6SXCXKG.js";import{b as l}from"./chunk-EUALCU5W.js";import{b as p}from"./chunk-AEECYACG.js";import{b as n}from"./chunk-CFG3P2H7.js";import{b as d}from"./chunk-F6VQTDND.js";import{a as e,b as r}from"./chunk-RR3YIVG4.js";import{e as o}from"./chunk-FAF55DAL.js";var i,t,A,h=o(()=>{r();n();a();d();s();f();c();l();m();p();u();i="pickingVertexShader",t=`attribute vec3 position;
#if defined(INSTANCES)
attribute float instanceMeshID;
#endif
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#include<instancesDeclaration>
uniform mat4 viewProjection;
#if defined(INSTANCES)
flat varying float vMeshID;
#endif
void main(void) {
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
vec4 worldPos=finalWorld*vec4(position,1.0);gl_Position=viewProjection*worldPos;
#if defined(INSTANCES)
vMeshID=instanceMeshID;
#endif
}
`;e.ShadersStore[i]||(e.ShadersStore[i]=t);A={name:i,shader:t}});export{A as a,h as b};
