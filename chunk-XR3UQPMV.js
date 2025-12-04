import{a as o,b as e}from"./chunk-RR3YIVG4.js";import{e as l}from"./chunk-FAF55DAL.js";var r,a,c,t=l(()=>{e();r="oitFinalPixelShader",a=`precision highp float;uniform sampler2D uFrontColor;uniform sampler2D uBackColor;void main() {ivec2 fragCoord=ivec2(gl_FragCoord.xy);vec4 frontColor=texelFetch(uFrontColor,fragCoord,0);vec4 backColor=texelFetch(uBackColor,fragCoord,0);float alphaMultiplier=1.0-frontColor.a;glFragColor=vec4(
frontColor.rgb+alphaMultiplier*backColor.rgb,
frontColor.a+backColor.a
);}`;o.ShadersStore[r]||(o.ShadersStore[r]=a);c={name:r,shader:a}});export{c as a,t as b};
