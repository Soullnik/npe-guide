import{a as e,b as r}from"./chunk-RR3YIVG4.js";import{e as i}from"./chunk-FAF55DAL.js";var o,t,a,s=i(()=>{r();o="postprocessVertexShader",t=`attribute vec2 position;uniform vec2 scale;varying vec2 vUV;const vec2 madd=vec2(0.5,0.5);
#define CUSTOM_VERTEX_DEFINITIONS
void main(void) {
#define CUSTOM_VERTEX_MAIN_BEGIN
vUV=(position*madd+madd)*scale;gl_Position=vec4(position,0.0,1.0);
#define CUSTOM_VERTEX_MAIN_END
}`;e.ShadersStore[o]||(e.ShadersStore[o]=t);a={name:o,shader:t}});export{a,s as b};
