import{a as U}from"./chunk-LHF76CJJ.js";import{a as V}from"./chunk-UTVAPBNU.js";import{a as x}from"./chunk-UDNH2VER.js";import{a,b as m}from"./chunk-OKZQ6WRX.js";import{a as c}from"./chunk-4WKELFDE.js";import{b as d}from"./chunk-QWNCEULT.js";import{b as u}from"./chunk-X3BTU7GT.js";import{b as p}from"./chunk-SB7DNKYL.js";import{b as s}from"./chunk-HYW3IX3E.js";import{b as l}from"./chunk-6LLYJ3LC.js";import{b as v}from"./chunk-44KF4Y2D.js";import{b as n}from"./chunk-X6BQIYVN.js";import{b as f}from"./chunk-37MJGIUG.js";import{a as e,b as o}from"./chunk-RR3YIVG4.js";import{e as r}from"./chunk-FAF55DAL.js";var t,i,y,S=r(()=>{o();n();a();f();d();u();x();V();p();s();c();l();m();v();U();t="outlineVertexShader",i=`attribute position: vec3f;attribute normal: vec3f;
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#include<clipPlaneVertexDeclaration>
uniform offset: f32;
#include<instancesDeclaration>
uniform viewProjection: mat4x4f;
#ifdef ALPHATEST
varying vUV: vec2f;uniform diffuseMatrix: mat4x4f; 
#ifdef UV1
attribute uv: vec2f;
#endif
#ifdef UV2
attribute uv2: vec2f;
#endif
#endif
#include<logDepthDeclaration>
#define CUSTOM_VERTEX_DEFINITIONS
@vertex
fn main(input: VertexInputs)->FragmentInputs {var positionUpdated: vec3f=vertexInputs.position;var normalUpdated: vec3f=vertexInputs.normal;
#ifdef UV1
var uvUpdated: vec2f=vertexInputs.uv;
#endif
#ifdef UV2
var uv2Updated: vec2f=vertexInputs.uv2;
#endif
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
var offsetPosition: vec3f=positionUpdated+(normalUpdated*uniforms.offset);
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
var worldPos: vec4f=finalWorld*vec4f(offsetPosition,1.0);vertexOutputs.position=uniforms.viewProjection*worldPos;
#ifdef ALPHATEST
#ifdef UV1
vertexOutputs.vUV=(uniforms.diffuseMatrix*vec4f(uvUpdated,1.0,0.0)).xy;
#endif
#ifdef UV2
vertexOutputs.vUV=(uniforms.diffuseMatrix*vec4f(uv2Updated,1.0,0.0)).xy;
#endif
#endif
#include<clipPlaneVertex>
#include<logDepthVertex>
}
`;e.ShadersStoreWGSL[t]||(e.ShadersStoreWGSL[t]=i);y={name:t,shader:i}});export{y as a,S as b};
