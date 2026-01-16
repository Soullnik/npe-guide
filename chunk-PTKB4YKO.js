import{a as U}from"./chunk-RFPGAPJM.js";import{a as p}from"./chunk-PNTHVEFJ.js";import{a as d}from"./chunk-BQE7GYLC.js";import{a as s}from"./chunk-IVHC7JH2.js";import{a,b as V}from"./chunk-JZRHVK4S.js";import{b as x}from"./chunk-ZCMQZ5PS.js";import{b as c}from"./chunk-ULVUJYNM.js";import{b as f}from"./chunk-F6VQTDND.js";import{b as l}from"./chunk-7WAK3VD7.js";import{b as u}from"./chunk-O6SXCXKG.js";import{b as m}from"./chunk-EUALCU5W.js";import{b as v}from"./chunk-AEECYACG.js";import{b as n}from"./chunk-CFG3P2H7.js";import{a as e,b as r}from"./chunk-RR3YIVG4.js";import{e as o}from"./chunk-FAF55DAL.js";var i,t,H,h=o(()=>{r();n();a();f();l();c();d();p();u();m();s();v();V();x();U();i="outlineVertexShader",t=`attribute vec3 position;attribute vec3 normal;
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#include<clipPlaneVertexDeclaration>
uniform float offset;
#include<instancesDeclaration>
uniform mat4 viewProjection;
#ifdef ALPHATEST
varying vec2 vUV;uniform mat4 diffuseMatrix;
#ifdef UV1
attribute vec2 uv;
#endif
#ifdef UV2
attribute vec2 uv2;
#endif
#endif
#include<logDepthDeclaration>
#define CUSTOM_VERTEX_DEFINITIONS
void main(void)
{vec3 positionUpdated=position;vec3 normalUpdated=normal;
#ifdef UV1
vec2 uvUpdated=uv;
#endif
#ifdef UV2
vec2 uv2Updated=uv2;
#endif
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
vec3 offsetPosition=positionUpdated+(normalUpdated*offset);
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
vec4 worldPos=finalWorld*vec4(offsetPosition,1.0);gl_Position=viewProjection*worldPos;
#ifdef ALPHATEST
#ifdef UV1
vUV=vec2(diffuseMatrix*vec4(uvUpdated,1.0,0.0));
#endif
#ifdef UV2
vUV=vec2(diffuseMatrix*vec4(uv2Updated,1.0,0.0));
#endif
#endif
#include<clipPlaneVertex>
#include<logDepthVertex>
}
`;e.ShadersStore[i]||(e.ShadersStore[i]=t);H={name:i,shader:t}});export{H as a,h as b};
