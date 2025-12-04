import{a as e,b as a}from"./chunk-RR3YIVG4.js";import{e as i}from"./chunk-FAF55DAL.js";var d,o,r,t=i(()=>{a();d="pickingPixelShader",o=`#if defined(INSTANCES)
flat varying float vMeshID;
#else
uniform float meshID;
#endif
void main(void) {float id;
#if defined(INSTANCES)
id=vMeshID;
#else
id=meshID;
#endif
#if defined(WEBGL2) || defined(WEBGPU) || defined(NATIVE)
int castedId=int(id);vec3 color=vec3(
float((castedId>>16) & 0xFF),
float((castedId>>8) & 0xFF),
float(castedId & 0xFF)
)/255.0;gl_FragColor=vec4(color,1.0);
#else
float castedId=floor(id+0.5);vec3 color=vec3(
floor(mod(castedId,16777216.0)/65536.0),
floor(mod(castedId,65536.0)/256.0),
mod(castedId,256.0)
)/255.0;gl_FragColor=vec4(color,1.0);
#endif
}
`;e.ShadersStore[d]||(e.ShadersStore[d]=o);r={name:d,shader:o}});export{r as a,t as b};
