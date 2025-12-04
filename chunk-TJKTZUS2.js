import{a as t,b as o}from"./chunk-RR3YIVG4.js";import{e as s}from"./chunk-FAF55DAL.js";var e,c,i,r=s(()=>{o();e="packingFunctions",c=`vec4 pack(float depth)
{const vec4 bit_shift=vec4(255.0*255.0*255.0,255.0*255.0,255.0,1.0);const vec4 bit_mask=vec4(0.0,1.0/255.0,1.0/255.0,1.0/255.0);vec4 res=fract(depth*bit_shift);res-=res.xxyz*bit_mask;return res;}
float unpack(vec4 color)
{const vec4 bit_shift=vec4(1.0/(255.0*255.0*255.0),1.0/(255.0*255.0),1.0/255.0,1.0);return dot(color,bit_shift);}`;t.IncludesShadersStore[e]||(t.IncludesShadersStore[e]=c);i={name:e,shader:c}});export{i as a,r as b};
