import{a as x}from"./chunk-6FZ5VE3C.js";import{a as h}from"./chunk-BQE7GYLC.js";import{a as v}from"./chunk-IVHC7JH2.js";import{a as f,b as V}from"./chunk-JZRHVK4S.js";import{b as c}from"./chunk-7WAK3VD7.js";import{b as p}from"./chunk-ULVUJYNM.js";import{b as s}from"./chunk-O6SXCXKG.js";import{b as u}from"./chunk-EUALCU5W.js";import{b as m}from"./chunk-AEECYACG.js";import{b as S}from"./chunk-ZCMQZ5PS.js";import{b as a}from"./chunk-CFG3P2H7.js";import{b as l}from"./chunk-F6VQTDND.js";import{a as e,b as o}from"./chunk-RR3YIVG4.js";import{e as t}from"./chunk-FAF55DAL.js";var r,E,d=t(()=>{"use strict";o();r="pointCloudVertexDeclaration",E=`#ifdef POINTSIZE
uniform float pointSize;
#endif
`;e.IncludesShadersStore[r]||(e.IncludesShadersStore[r]=E)});var i,n,H,U=t(()=>{o();a();f();l();c();p();h();d();s();u();v();m();V();S();x();i="depthVertexShader",n=`attribute vec3 position;
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#include<clipPlaneVertexDeclaration>
#include<instancesDeclaration>
uniform mat4 viewProjection;uniform vec2 depthValues;
#if defined(ALPHATEST) || defined(NEED_UV)
varying vec2 vUV;uniform mat4 diffuseMatrix;
#ifdef UV1
attribute vec2 uv;
#endif
#ifdef UV2
attribute vec2 uv2;
#endif
#endif
#ifdef STORE_CAMERASPACE_Z
uniform mat4 view;varying vec4 vViewPos;
#endif
#include<pointCloudVertexDeclaration>
varying float vDepthMetric;
#define CUSTOM_VERTEX_DEFINITIONS
void main(void)
{vec3 positionUpdated=position;
#ifdef UV1
vec2 uvUpdated=uv;
#endif
#ifdef UV2
vec2 uv2Updated=uv2;
#endif
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
vec4 worldPos=finalWorld*vec4(positionUpdated,1.0);
#include<clipPlaneVertex>
gl_Position=viewProjection*worldPos;
#ifdef STORE_CAMERASPACE_Z
vViewPos=view*worldPos;
#else
#ifdef USE_REVERSE_DEPTHBUFFER
vDepthMetric=((-gl_Position.z+depthValues.x)/(depthValues.y));
#else
vDepthMetric=((gl_Position.z+depthValues.x)/(depthValues.y));
#endif
#endif
#if defined(ALPHATEST) || defined(BASIC_RENDER)
#ifdef UV1
vUV=vec2(diffuseMatrix*vec4(uvUpdated,1.0,0.0));
#endif
#ifdef UV2
vUV=vec2(diffuseMatrix*vec4(uv2Updated,1.0,0.0));
#endif
#endif
#include<pointCloudVertex>
}
`;e.ShadersStore[i]||(e.ShadersStore[i]=n);H={name:i,shader:n}});export{H as a,U as b};
