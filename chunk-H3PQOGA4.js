import{a as e,b as o}from"./chunk-RR3YIVG4.js";import{e as t}from"./chunk-FAF55DAL.js";var i,r,a,n=t(()=>{o();i="hdrIrradianceFilteringVertexShader",r=`attribute vec2 position;varying vec3 direction;uniform vec3 up;uniform vec3 right;uniform vec3 front;
#define CUSTOM_VERTEX_DEFINITIONS
void main(void) {
#define CUSTOM_VERTEX_MAIN_BEGIN
mat3 view=mat3(up,right,front);direction=view*vec3(position,1.0);gl_Position=vec4(position,0.0,1.0);
#define CUSTOM_VERTEX_MAIN_END
}`;e.ShadersStore[i]||(e.ShadersStore[i]=r);a={name:i,shader:r}});export{a,n as b};
