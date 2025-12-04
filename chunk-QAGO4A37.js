import{a as e,b as l}from"./chunk-RR3YIVG4.js";import{e as a}from"./chunk-FAF55DAL.js";var r,o,i,t=a(()=>{l();r="lensFlarePixelShader",o=`varying vec2 vUV;uniform sampler2D textureSampler;uniform vec4 color;
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
vec4 baseColor=texture2D(textureSampler,vUV);gl_FragColor=baseColor*color;
#define CUSTOM_FRAGMENT_MAIN_END
}`;e.ShadersStore[r]||(e.ShadersStore[r]=o);i={name:r,shader:o}});export{i as a,t as b};
