import{a as p}from"./chunk-2EH2RAN5.js";import{a as E}from"./chunk-HT7YYHI2.js";import{a as V}from"./chunk-QNXXW2YE.js";import{a as s}from"./chunk-BQE7GYLC.js";import{a as l}from"./chunk-IVHC7JH2.js";import{a as d,b as f}from"./chunk-JZRHVK4S.js";import{b as c}from"./chunk-ULVUJYNM.js";import{b as a}from"./chunk-AEECYACG.js";import{b as m}from"./chunk-ZCMQZ5PS.js";import{b as t}from"./chunk-CFG3P2H7.js";import{a as e,b as n}from"./chunk-RR3YIVG4.js";import{e as r}from"./chunk-FAF55DAL.js";var i,o,g,u=r(()=>{n();t();d();c();V();s();l();a();f();m();E();p();i="colorVertexShader",o=`attribute vec3 position;
#ifdef VERTEXCOLOR
attribute vec4 color;
#endif
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<clipPlaneVertexDeclaration>
#include<fogVertexDeclaration>
#ifdef FOG
uniform mat4 view;
#endif
#include<instancesDeclaration>
uniform mat4 viewProjection;
#ifdef MULTIVIEW
uniform mat4 viewProjectionR;
#endif
#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
varying vec4 vColor;
#endif
#define CUSTOM_VERTEX_DEFINITIONS
void main(void) {
#define CUSTOM_VERTEX_MAIN_BEGIN
#ifdef VERTEXCOLOR
vec4 colorUpdated=color;
#endif
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
vec4 worldPos=finalWorld*vec4(position,1.0);
#ifdef MULTIVIEW
if (gl_ViewID_OVR==0u) {gl_Position=viewProjection*worldPos;} else {gl_Position=viewProjectionR*worldPos;}
#else
gl_Position=viewProjection*worldPos;
#endif
#include<clipPlaneVertex>
#include<fogVertex>
#include<vertexColorMixing>
#define CUSTOM_VERTEX_MAIN_END
}`;e.ShadersStore[i]||(e.ShadersStore[i]=o);g={name:i,shader:o}});export{g as a,u as b};
