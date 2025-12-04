import{a as V}from"./chunk-UHREBOBB.js";import{a as D}from"./chunk-XWI4LTJ3.js";import{a as N}from"./chunk-6R2MQ2L3.js";import{b as W}from"./chunk-P3WF2Y27.js";import{b as M}from"./chunk-3Q5BZMII.js";import{a as T}from"./chunk-IVHC7JH2.js";import{a as h,b}from"./chunk-JZRHVK4S.js";import{b as x}from"./chunk-7WAK3VD7.js";import{b as w}from"./chunk-ULVUJYNM.js";import{b as U}from"./chunk-O6SXCXKG.js";import{b as I}from"./chunk-EUALCU5W.js";import{b as A}from"./chunk-AEECYACG.js";import{b as g}from"./chunk-ZCMQZ5PS.js";import{b as u}from"./chunk-CFG3P2H7.js";import{b as v}from"./chunk-F6VQTDND.js";import{a as e,b as o}from"./chunk-RR3YIVG4.js";import{e as r}from"./chunk-FAF55DAL.js";var i,E,a=r(()=>{"use strict";o();i="meshVertexDeclaration",E=`uniform mat4 world;uniform float visibility;
`;e.IncludesShadersStore[i]||(e.IncludesShadersStore[i]=E)});var d,L,n=r(()=>{"use strict";o();V();a();d="shadowMapVertexDeclaration",L=`#include<sceneVertexDeclaration>
#include<meshVertexDeclaration>
`;e.IncludesShadersStore[d]||(e.IncludesShadersStore[d]=L)});var l,P,c=r(()=>{"use strict";o();N();D();l="shadowMapUboDeclaration",P=`layout(std140,column_major) uniform;
#include<sceneUboDeclaration>
#include<meshUboDeclaration>
`;e.IncludesShadersStore[l]||(e.IncludesShadersStore[l]=P)});var s,_,m=r(()=>{"use strict";o();s="shadowMapVertexExtraDeclaration",_=`#if SM_NORMALBIAS==1
uniform vec3 lightDataSM;
#endif
uniform vec3 biasAndScaleSM;uniform vec2 depthValuesSM;varying float vDepthMetricSM;
#if SM_USEDISTANCE==1
varying vec3 vPositionWSM;
#endif
#if defined(SM_DEPTHCLAMP) && SM_DEPTHCLAMP==1
varying float zSM;
#endif
`;e.IncludesShadersStore[s]||(e.IncludesShadersStore[s]=_)});var S,y,f=r(()=>{"use strict";o();S="shadowMapVertexNormalBias",y=`#if SM_NORMALBIAS==1
#if SM_DIRECTIONINLIGHTDATA==1
vec3 worldLightDirSM=normalize(-lightDataSM.xyz);
#else
vec3 directionToLightSM=lightDataSM.xyz-worldPos.xyz;vec3 worldLightDirSM=normalize(directionToLightSM);
#endif
float ndlSM=dot(vNormalW,worldLightDirSM);float sinNLSM=sqrt(1.0-ndlSM*ndlSM);float normalBiasSM=biasAndScaleSM.y*sinNLSM;worldPos.xyz-=vNormalW*normalBiasSM;
#endif
`;e.IncludesShadersStore[S]||(e.IncludesShadersStore[S]=y)});var t,p,Me,O=r(()=>{o();u();h();v();x();M();n();c();m();w();U();I();T();A();b();f();W();g();t="shadowMapVertexShader",p=`attribute vec3 position;
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
}`;e.ShadersStore[t]||(e.ShadersStore[t]=p);Me={name:t,shader:p}});export{a,Me as b,O as c};
