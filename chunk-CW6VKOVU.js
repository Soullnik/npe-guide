import{a as r,b as a}from"./chunk-RR3YIVG4.js";import{e as t}from"./chunk-FAF55DAL.js";var e,n,c,i=t(()=>{a();e="fluidRenderingParticleThicknessPixelShader",n=`uniform particleAlpha: f32;varying uv: vec2f;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var normalxy: vec2f=input.uv*2.0-1.0;var r2: f32=dot(normalxy,normalxy);if (r2>1.0) {discard;}
var thickness: f32=sqrt(1.0-r2);fragmentOutputs.color=vec4f(vec3f(uniforms.particleAlpha*thickness),1.0);}
`;r.ShadersStoreWGSL[e]||(r.ShadersStoreWGSL[e]=n);c={name:e,shader:n}});export{c as a,i as b};
