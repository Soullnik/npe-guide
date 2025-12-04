import{a as x}from"./chunk-SP7FA2JP.js";import{a as s}from"./chunk-5WAS3Z3M.js";import{a as u}from"./chunk-D2TMD5UV.js";import{a as m}from"./chunk-UDNH2VER.js";import{a as d,b as l}from"./chunk-OKZQ6WRX.js";import{a as c}from"./chunk-4WKELFDE.js";import{b as a}from"./chunk-X3BTU7GT.js";import{b as f}from"./chunk-6LLYJ3LC.js";import{b as p}from"./chunk-44KF4Y2D.js";import{b as n}from"./chunk-X6BQIYVN.js";import{a as e,b as o}from"./chunk-RR3YIVG4.js";import{e as r}from"./chunk-FAF55DAL.js";var i,t,b,S=r(()=>{o();n();d();a();u();m();c();f();l();p();s();x();i="colorVertexShader",t=`attribute position: vec3f;
#ifdef VERTEXCOLOR
attribute color: vec4f;
#endif
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<clipPlaneVertexDeclaration>
#include<fogVertexDeclaration>
#ifdef FOG
uniform view: mat4x4f;
#endif
#include<instancesDeclaration>
uniform viewProjection: mat4x4f;
#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
varying vColor: vec4f;
#endif
#define CUSTOM_VERTEX_DEFINITIONS
@vertex
fn main(input : VertexInputs)->FragmentInputs {
#define CUSTOM_VERTEX_MAIN_BEGIN
#ifdef VERTEXCOLOR
var colorUpdated: vec4f=vertexInputs.color;
#endif
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
var worldPos: vec4f=finalWorld* vec4f(input.position,1.0);vertexOutputs.position=uniforms.viewProjection*worldPos;
#include<clipPlaneVertex>
#include<fogVertex>
#include<vertexColorMixing>
#define CUSTOM_VERTEX_MAIN_END
}`;e.ShadersStoreWGSL[i]||(e.ShadersStoreWGSL[i]=t);b={name:i,shader:t}});export{b as a,S as b};
