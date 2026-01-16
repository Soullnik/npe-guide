import{a as r,b as n}from"./chunk-RR3YIVG4.js";import{e}from"./chunk-FAF55DAL.js";var o,t,l,a=e(()=>{n();o="oitFinalSimpleBlendPixelShader",t=`var uFrontColor: texture_2d<f32>;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var fragCoord: vec2i=vec2i(fragmentInputs.position.xy);var frontColor: vec4f=textureLoad(uFrontColor,fragCoord,0);fragmentOutputs.color=frontColor;}
`;r.ShadersStoreWGSL[o]||(r.ShadersStoreWGSL[o]=t);l={name:o,shader:t}});a();export{l as oitFinalSimpleBlendPixelShaderWGSL};
