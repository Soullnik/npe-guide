import{a as S}from"./chunk-MFJUZDUZ.js";import{b as d}from"./chunk-CGKO47GG.js";import{b as l}from"./chunk-ENWF5TL3.js";import{b as a}from"./chunk-F2BF3OFM.js";import{a as e,b as n}from"./chunk-RR3YIVG4.js";import{e as i}from"./chunk-FAF55DAL.js";var o,r,O,f=i(()=>{n();d();l();a();S();o="colorPixelShader",r=`#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
#define VERTEXCOLOR
varying vec4 vColor;
#else
uniform vec4 color;
#endif
#include<clipPlaneFragmentDeclaration>
#include<fogFragmentDeclaration>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
gl_FragColor=vColor;
#else
gl_FragColor=color;
#endif
#include<fogFragment>(color,gl_FragColor)
#define CUSTOM_FRAGMENT_MAIN_END
}`;e.ShadersStore[o]||(e.ShadersStore[o]=r);O={name:o,shader:r}});export{O as a,f as b};
