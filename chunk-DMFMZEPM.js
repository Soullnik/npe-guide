import{b as W}from"./chunk-P3WF2Y27.js";import{a as b}from"./chunk-4ROQ5EEZ.js";import{a as I}from"./chunk-UHREBOBB.js";import{a as M}from"./chunk-XWI4LTJ3.js";import{a as p}from"./chunk-6R2MQ2L3.js";import{a as U}from"./chunk-IVHC7JH2.js";import{a as v,b as T}from"./chunk-JZRHVK4S.js";import{b as A}from"./chunk-ZCMQZ5PS.js";import{b as h}from"./chunk-ULVUJYNM.js";import{b as x}from"./chunk-F6VQTDND.js";import{b as V}from"./chunk-7WAK3VD7.js";import{b as N}from"./chunk-O6SXCXKG.js";import{b as D}from"./chunk-EUALCU5W.js";import{b as w}from"./chunk-AEECYACG.js";import{b as u}from"./chunk-CFG3P2H7.js";import{b as f}from"./chunk-3Q5BZMII.js";import{a as e,b as o}from"./chunk-RR3YIVG4.js";import{e as r}from"./chunk-FAF55DAL.js";var i,g,a=r(()=>{"use strict";o();I();b();i="shadowMapVertexDeclaration",g=`#include<sceneVertexDeclaration>
#include<meshVertexDeclaration>
`;e.IncludesShadersStore[i]||(e.IncludesShadersStore[i]=g)});var d,E,n=r(()=>{"use strict";o();p();M();d="shadowMapUboDeclaration",E=`layout(std140,column_major) uniform;
#include<sceneUboDeclaration>
#include<meshUboDeclaration>
`;e.IncludesShadersStore[d]||(e.IncludesShadersStore[d]=E)});var l,L,c=r(()=>{"use strict";o();l="shadowMapVertexExtraDeclaration",L=`#if SM_NORMALBIAS==1
uniform vec3 lightDataSM;
#endif
uniform vec3 biasAndScaleSM;uniform vec2 depthValuesSM;varying float vDepthMetricSM;
#if SM_USEDISTANCE==1
varying vec3 vPositionWSM;
#endif
#if defined(SM_DEPTHCLAMP) && SM_DEPTHCLAMP==1
varying float zSM;
#endif
`;e.IncludesShadersStore[l]||(e.IncludesShadersStore[l]=L)});var s,P,m=r(()=>{"use strict";o();s="shadowMapVertexNormalBias",P=`#if SM_NORMALBIAS==1
#if SM_DIRECTIONINLIGHTDATA==1
vec3 worldLightDirSM=normalize(-lightDataSM.xyz);
#else
vec3 directionToLightSM=lightDataSM.xyz-worldPos.xyz;vec3 worldLightDirSM=normalize(directionToLightSM);
#endif
float ndlSM=dot(vNormalW,worldLightDirSM);float sinNLSM=sqrt(1.0-ndlSM*ndlSM);float normalBiasSM=biasAndScaleSM.y*sinNLSM;worldPos.xyz-=vNormalW*normalBiasSM;
#endif
`;e.IncludesShadersStore[s]||(e.IncludesShadersStore[s]=P)});var t,S,me,_=r(()=>{o();u();v();x();V();f();a();n();c();h();N();D();U();w();T();m();W();A();t="shadowMapVertexShader",S=`attribute vec3 position;
#ifdef NORMAL
attribute vec3 normal;
#endif
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#ifdef INSTANCES
attribute vec4 world0;attribute vec4 world1;attribute vec4 world2;attribute vec4 world3;
#endif
#include<helperFunctions>
#include<__decl__shadowMapVertex>
#ifdef ALPHATEXTURE
varying vec2 vUV;uniform mat4 diffuseMatrix;
#ifdef UV1
attribute vec2 uv;
#endif
#ifdef UV2
attribute vec2 uv2;
#endif
#endif
#include<shadowMapVertexExtraDeclaration>
#include<clipPlaneVertexDeclaration>
#define CUSTOM_VERTEX_DEFINITIONS
void main(void)
{vec3 positionUpdated=position;
#ifdef UV1
vec2 uvUpdated=uv;
#endif
#ifdef UV2
vec2 uv2Updated=uv2;
#endif
#ifdef NORMAL
vec3 normalUpdated=normal;
#endif
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
vec4 worldPos=finalWorld*vec4(positionUpdated,1.0);
#ifdef NORMAL
mat3 normWorldSM=mat3(finalWorld);
#if defined(INSTANCES) && defined(THIN_INSTANCES)
vec3 vNormalW=normalUpdated/vec3(dot(normWorldSM[0],normWorldSM[0]),dot(normWorldSM[1],normWorldSM[1]),dot(normWorldSM[2],normWorldSM[2]));vNormalW=normalize(normWorldSM*vNormalW);
#else
#ifdef NONUNIFORMSCALING
normWorldSM=transposeMat3(inverseMat3(normWorldSM));
#endif
vec3 vNormalW=normalize(normWorldSM*normalUpdated);
#endif
#endif
#include<shadowMapVertexNormalBias>
gl_Position=viewProjection*worldPos;
#include<shadowMapVertexMetric>
#ifdef ALPHATEXTURE
#ifdef UV1
vUV=vec2(diffuseMatrix*vec4(uvUpdated,1.0,0.0));
#endif
#ifdef UV2
vUV=vec2(diffuseMatrix*vec4(uv2Updated,1.0,0.0));
#endif
#endif
#include<clipPlaneVertex>
}`;e.ShadersStore[t]||(e.ShadersStore[t]=S);me={name:t,shader:S}});export{me as a,_ as b};
