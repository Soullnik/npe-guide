import{a as r,b as t}from"./chunk-RR3YIVG4.js";import{e as a}from"./chunk-FAF55DAL.js";var i,o,s,e=a(()=>{t();i="lightProxyPixelShader",o=`flat varying vec2 vLimits;flat varying highp uint vMask;void main(void) {if (gl_FragCoord.y<vLimits.x || gl_FragCoord.y>vLimits.y) {discard;}
gl_FragColor=vec4(vMask,0,0,1);}
`;r.ShadersStore[i]||(r.ShadersStore[i]=o);s={name:i,shader:o}});export{s as a,e as b};
