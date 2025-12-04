import{a as r,b as e}from"./chunk-RR3YIVG4.js";import{e as a}from"./chunk-FAF55DAL.js";var o,t,f,n=a(()=>{e();o="oitFinalPixelShader",t=`var uFrontColor: texture_2d<f32>;var uBackColor: texture_2d<f32>;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var fragCoord: vec2i=vec2i(fragmentInputs.position.xy);var frontColor: vec4f=textureLoad(uFrontColor,fragCoord,0);var backColor: vec4f=textureLoad(uBackColor,fragCoord,0);var alphaMultiplier: f32=1.0-frontColor.a;fragmentOutputs.color=vec4f(
frontColor.rgb+alphaMultiplier*backColor.rgb,
frontColor.a+backColor.a
);}
`;r.ShadersStoreWGSL[o]||(r.ShadersStoreWGSL[o]=t);f={name:o,shader:t}});export{f as a,n as b};
