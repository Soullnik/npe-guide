import{a as e,b as f}from"./chunk-RR3YIVG4.js";import{e as n}from"./chunk-FAF55DAL.js";var i,r,o,t=n(()=>{f();i="pickingPixelShader",r=`#if defined(INSTANCES)
flat varying vMeshID: f32;
#else
uniform meshID: f32;
#endif
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var id: i32;
#if defined(INSTANCES)
id=i32(input.vMeshID);
#else
id=i32(uniforms.meshID);
#endif
var color=vec3f(
f32((id>>16) & 0xFF),
f32((id>>8) & 0xFF),
f32(id & 0xFF),
)/255.0;fragmentOutputs.color=vec4f(color,1.0);}
`;e.ShadersStoreWGSL[i]||(e.ShadersStoreWGSL[i]=r);o={name:i,shader:r}});export{o as a,t as b};
