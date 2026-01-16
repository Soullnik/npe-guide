import{a as s}from"./chunk-UDNH2VER.js";import{a}from"./chunk-SEV7IZPG.js";import{a as f}from"./chunk-YD7SUAXC.js";import{a as u}from"./chunk-4WKELFDE.js";import{b as d}from"./chunk-37MJGIUG.js";import{b as p}from"./chunk-QWNCEULT.js";import{b as c}from"./chunk-SB7DNKYL.js";import{b as m}from"./chunk-HYW3IX3E.js";import{b as l}from"./chunk-6LLYJ3LC.js";import{b as o}from"./chunk-IRM2HBZN.js";import{a as e,b as n}from"./chunk-RR3YIVG4.js";import{e as r}from"./chunk-FAF55DAL.js";var t,i,A,S=r(()=>{n();o();a();d();p();s();c();m();u();l();f();t="pickingVertexShader",i=`attribute position: vec3f;
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
fn main(input : VertexInputs)->FragmentInputs {var positionUpdated: vec3f=input.position;
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
var worldPos: vec4f=finalWorld*vec4f(positionUpdated,1.0);vertexOutputs.position=uniforms.viewProjection*worldPos;
#if defined(INSTANCES)
vertexOutputs.vMeshID=input.instanceMeshID;
#endif
}
`;e.ShadersStoreWGSL[t]||(e.ShadersStoreWGSL[t]=i);A={name:t,shader:i}});export{A as a,S as b};
