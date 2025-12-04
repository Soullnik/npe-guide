import{a as f}from"./chunk-UDNH2VER.js";import{a,b as l}from"./chunk-OKZQ6WRX.js";import{a as m}from"./chunk-4WKELFDE.js";import{b as d}from"./chunk-QWNCEULT.js";import{b as p}from"./chunk-SB7DNKYL.js";import{b as c}from"./chunk-HYW3IX3E.js";import{b as u}from"./chunk-6LLYJ3LC.js";import{b as o}from"./chunk-X6BQIYVN.js";import{b as s}from"./chunk-37MJGIUG.js";import{a as e,b as n}from"./chunk-RR3YIVG4.js";import{e as r}from"./chunk-FAF55DAL.js";var t,i,A,S=r(()=>{n();o();a();s();d();f();p();c();m();u();l();t="pickingVertexShader",i=`attribute position: vec3f;
#if defined(INSTANCES)
attribute instanceMeshID: f32;
#endif
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#include<instancesDeclaration>
uniform viewProjection: mat4x4f;
#if defined(INSTANCES)
flat varying vMeshID: f32;
#endif
@vertex
fn main(input : VertexInputs)->FragmentInputs {
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
var worldPos: vec4f=finalWorld*vec4f(input.position,1.0);vertexOutputs.position=uniforms.viewProjection*worldPos;
#if defined(INSTANCES)
vertexOutputs.vMeshID=input.instanceMeshID;
#endif
}
`;e.ShadersStoreWGSL[t]||(e.ShadersStoreWGSL[t]=i);A={name:t,shader:i}});export{A as a,S as b};
