import{a as e,b as o}from"./chunk-RR3YIVG4.js";import{e as i}from"./chunk-FAF55DAL.js";var r,t,n,a=i(()=>{o();r="highlightsPixelShader",t=`varying vec2 vUV;uniform sampler2D textureSampler;const vec3 RGBLuminanceCoefficients=vec3(0.2126,0.7152,0.0722);
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) 
{vec4 tex=texture2D(textureSampler,vUV);vec3 c=tex.rgb;float luma=dot(c.rgb,RGBLuminanceCoefficients);gl_FragColor=vec4(pow(c,vec3(25.0-luma*15.0)),tex.a); }`;e.ShadersStore[r]||(e.ShadersStore[r]=t);n={name:r,shader:t}});export{n as a,a as b};
