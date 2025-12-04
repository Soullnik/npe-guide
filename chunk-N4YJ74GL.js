import{a as t,b as o}from"./chunk-RR3YIVG4.js";import{e as a}from"./chunk-FAF55DAL.js";var e,r,s,n=a(()=>{o();e="oitBackBlendPixelShader",r=`var uBackColor: texture_2d<f32>;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {fragmentOutputs.color=textureLoad(uBackColor,vec2i(fragmentInputs.position.xy),0);if (fragmentOutputs.color.a==0.0) {discard;}}
`;t.ShadersStoreWGSL[e]||(t.ShadersStoreWGSL[e]=r);s={name:e,shader:r}});export{s as a,n as b};
