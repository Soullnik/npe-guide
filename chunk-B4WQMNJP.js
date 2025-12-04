import{a as r,b as n}from"./chunk-RR3YIVG4.js";import{e as i}from"./chunk-FAF55DAL.js";var e,a,o,t=i(()=>{n();e="fluidRenderingParticleDiffusePixelShader",a=`uniform particleAlpha: f32;varying uv: vec2f;varying diffuseColor: vec3f;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var normalxy: vec2f=input.uv*2.0-1.0;var r2: f32=dot(normalxy,normalxy);if (r2>1.0) {discard;}
fragmentOutputs.color=vec4f(input.diffuseColor,1.0);}
`;r.ShadersStoreWGSL[e]||(r.ShadersStoreWGSL[e]=a);o={name:e,shader:a}});export{o as a,t as b};
