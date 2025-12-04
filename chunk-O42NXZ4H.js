import{a as e,b as o}from"./chunk-RR3YIVG4.js";import{e as s}from"./chunk-FAF55DAL.js";var r,a,t,i=s(()=>{o();r="displayPassPixelShader",a=`varying vec2 vUV;uniform sampler2D textureSampler;uniform sampler2D passSampler;
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void)
{gl_FragColor=texture2D(passSampler,vUV);}`;e.ShadersStore[r]||(e.ShadersStore[r]=a);t={name:r,shader:a}});export{t as a,i as b};
