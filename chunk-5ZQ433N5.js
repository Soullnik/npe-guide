import{a as e,b as t}from"./chunk-RR3YIVG4.js";import{e as o}from"./chunk-FAF55DAL.js";var r,n,i,S=o(()=>{t();r="boundingBoxRendererPixelShader",n=`uniform color: vec4f;
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
fragmentOutputs.color=uniforms.color;
#define CUSTOM_FRAGMENT_MAIN_END
}`;e.ShadersStoreWGSL[r]||(e.ShadersStoreWGSL[r]=n);i={name:r,shader:n}});export{i as a,S as b};
