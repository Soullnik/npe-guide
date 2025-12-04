import{b as c}from"./chunk-3Q5BZMII.js";import{a as e,b as t}from"./chunk-RR3YIVG4.js";import{e as l}from"./chunk-FAF55DAL.js";var o,r,d,i=l(()=>{t();c();o="copyTextureToTexturePixelShader",r=`uniform float conversion;uniform sampler2D textureSampler;uniform float lodLevel;varying vec2 vUV;
#include<helperFunctions>
void main(void) 
{
#ifdef NO_SAMPLER
vec4 color=texelFetch(textureSampler,ivec2(gl_FragCoord.xy),0);
#else
vec4 color=textureLod(textureSampler,vUV,lodLevel);
#endif
#ifdef DEPTH_TEXTURE
gl_FragDepth=color.r;
#else
if (conversion==1.) {color=toLinearSpace(color);} else if (conversion==2.) {color=toGammaSpace(color);}
gl_FragColor=color;
#endif
}
`;e.ShadersStore[o]||(e.ShadersStore[o]=r);d={name:o,shader:r}});export{d as a,i as b};
