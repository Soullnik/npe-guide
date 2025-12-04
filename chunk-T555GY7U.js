import{a as t,b as r}from"./chunk-RR3YIVG4.js";import{e as s}from"./chunk-FAF55DAL.js";var e,c,o,f=s(()=>{r();e="packingFunctions",c=`fn pack(depth: f32)->vec4f
{const bit_shift: vec4f= vec4f(255.0*255.0*255.0,255.0*255.0,255.0,1.0);const bit_mask: vec4f= vec4f(0.0,1.0/255.0,1.0/255.0,1.0/255.0);var res: vec4f=fract(depth*bit_shift);res-=res.xxyz*bit_mask;return res;}
fn unpack(color: vec4f)->f32
{const bit_shift: vec4f= vec4f(1.0/(255.0*255.0*255.0),1.0/(255.0*255.0),1.0/255.0,1.0);return dot(color,bit_shift);}`;t.IncludesShadersStoreWGSL[e]||(t.IncludesShadersStoreWGSL[e]=c);o={name:e,shader:c}});export{o as a,f as b};
