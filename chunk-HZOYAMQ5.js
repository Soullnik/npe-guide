import{a as v}from"./chunk-RFPGAPJM.js";import{a as p}from"./chunk-PNTHVEFJ.js";import{a as s}from"./chunk-XWI4LTJ3.js";import{a as l}from"./chunk-6R2MQ2L3.js";import{a as P}from"./chunk-BQE7GYLC.js";import{a as f}from"./chunk-IVHC7JH2.js";import{b as m}from"./chunk-ULVUJYNM.js";import{b as S}from"./chunk-ZCMQZ5PS.js";import{a as e,b as o}from"./chunk-RR3YIVG4.js";import{e as i}from"./chunk-FAF55DAL.js";var t,x,n=i(()=>{"use strict";o();t="lineVertexDeclaration",x=`uniform mat4 viewProjection;
#define ADDITIONAL_VERTEX_DECLARATION
`;e.IncludesShadersStore[t]||(e.IncludesShadersStore[t]=x)});var c,u,a=i(()=>{"use strict";o();l();s();c="lineUboDeclaration",u=`layout(std140,column_major) uniform;
#include<sceneUboDeclaration>
#include<meshUboDeclaration>
`;e.IncludesShadersStore[c]||(e.IncludesShadersStore[c]=u)});var r,d,O,w=i(()=>{o();n();a();P();m();p();f();S();v();r="lineVertexShader",d=`#include<__decl__lineVertex>
#include<instancesDeclaration>
#include<clipPlaneVertexDeclaration>
attribute vec3 position;attribute vec4 normal;uniform float width;uniform float aspectRatio;
#include<logDepthDeclaration>
#define CUSTOM_VERTEX_DEFINITIONS
void main(void) {
#define CUSTOM_VERTEX_MAIN_BEGIN
#include<instancesVertex>
mat4 worldViewProjection=viewProjection*finalWorld;vec4 viewPosition=worldViewProjection*vec4(position,1.0);vec4 viewPositionNext=worldViewProjection*vec4(normal.xyz,1.0);vec2 currentScreen=viewPosition.xy/viewPosition.w;vec2 nextScreen=viewPositionNext.xy/viewPositionNext.w;currentScreen.x*=aspectRatio;nextScreen.x*=aspectRatio;vec2 dir=normalize(nextScreen-currentScreen);vec2 normalDir=vec2(-dir.y,dir.x);normalDir*=width/2.0;normalDir.x/=aspectRatio;vec4 offset=vec4(normalDir*normal.w,0.0,0.0);gl_Position=viewPosition+offset;
#if defined(CLIPPLANE) || defined(CLIPPLANE2) || defined(CLIPPLANE3) || defined(CLIPPLANE4) || defined(CLIPPLANE5) || defined(CLIPPLANE6)
vec4 worldPos=finalWorld*vec4(position,1.0);
#include<clipPlaneVertex>
#endif
#include<logDepthVertex>
#define CUSTOM_VERTEX_MAIN_END
}`;e.ShadersStore[r]||(e.ShadersStore[r]=d);O={name:r,shader:d}});export{O as a,w as b};
