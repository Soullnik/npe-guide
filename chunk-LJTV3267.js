import{a as f}from"./chunk-UDNH2VER.js";import{a as d}from"./chunk-SEV7IZPG.js";import{a as l}from"./chunk-YD7SUAXC.js";import{a as c}from"./chunk-4WKELFDE.js";import{b as u}from"./chunk-37MJGIUG.js";import{b as s}from"./chunk-QWNCEULT.js";import{b as p}from"./chunk-SB7DNKYL.js";import{b as v}from"./chunk-HYW3IX3E.js";import{b as m}from"./chunk-6LLYJ3LC.js";import{b as x}from"./chunk-44KF4Y2D.js";import{b as o}from"./chunk-IRM2HBZN.js";import{b as a}from"./chunk-X3BTU7GT.js";import{a as e,b as n}from"./chunk-RR3YIVG4.js";import{e as r}from"./chunk-FAF55DAL.js";var t,i,b,V=r(()=>{n();o();d();u();s();a();f();p();v();c();m();l();x();t="depthVertexShader",i=`attribute position: vec3f;
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#include<clipPlaneVertexDeclaration>
#include<instancesDeclaration>
uniform viewProjection: mat4x4f;uniform depthValues: vec2f;
#if defined(ALPHATEST) || defined(NEED_UV)
varying vUV: vec2f;uniform diffuseMatrix: mat4x4f;
#ifdef UV1
attribute uv: vec2f;
#endif
#ifdef UV2
attribute uv2: vec2f;
#endif
#endif
#ifdef STORE_CAMERASPACE_Z
uniform view: mat4x4f;varying vViewPos: vec4f;
#endif
varying vDepthMetric: f32;
#define CUSTOM_VERTEX_DEFINITIONS
@vertex
fn main(input : VertexInputs)->FragmentInputs {var positionUpdated: vec3f=input.position;
#ifdef UV1
var uvUpdated: vec2f=input.uv;
#endif
#ifdef UV2
var uv2Updated: vec2f=input.uv2;
#endif
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
var worldPos: vec4f=finalWorld* vec4f(positionUpdated,1.0);
#include<clipPlaneVertex>
vertexOutputs.position=uniforms.viewProjection*worldPos;
#ifdef STORE_CAMERASPACE_Z
vertexOutputs.vViewPos=uniforms.view*worldPos;
#else
#ifdef USE_REVERSE_DEPTHBUFFER
vertexOutputs.vDepthMetric=((-vertexOutputs.position.z+uniforms.depthValues.x)/(uniforms.depthValues.y));
#else
vertexOutputs.vDepthMetric=((vertexOutputs.position.z+uniforms.depthValues.x)/(uniforms.depthValues.y));
#endif
#endif
#if defined(ALPHATEST) || defined(BASIC_RENDER)
#ifdef UV1
vertexOutputs.vUV= (uniforms.diffuseMatrix* vec4f(uvUpdated,1.0,0.0)).xy;
#endif
#ifdef UV2
vertexOutputs.vUV= (uniforms.diffuseMatrix* vec4f(uv2Updated,1.0,0.0)).xy;
#endif
#endif
}
`;e.ShadersStoreWGSL[t]||(e.ShadersStoreWGSL[t]=i);b={name:t,shader:i}});export{b as a,V as b};
