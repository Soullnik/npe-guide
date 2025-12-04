import{a as e,b as t}from"./chunk-RR3YIVG4.js";import{e as r}from"./chunk-FAF55DAL.js";var o,i,a,d=r(()=>{t();o="proceduralVertexShader",i=`attribute vec2 position;varying vec2 vPosition;varying vec2 vUV;const vec2 madd=vec2(0.5,0.5);
#define CUSTOM_VERTEX_DEFINITIONS
void main(void) {
#define CUSTOM_VERTEX_MAIN_BEGIN
vPosition=position;vUV=position*madd+madd;gl_Position=vec4(position,0.0,1.0);
#define CUSTOM_VERTEX_MAIN_END
}`;e.ShadersStore[o]||(e.ShadersStore[o]=i);a={name:o,shader:i}});export{a,d as b};
