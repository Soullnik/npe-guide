import{a as e,b as a}from"./chunk-RR3YIVG4.js";import{e as o}from"./chunk-FAF55DAL.js";var r,d,l=o(()=>{"use strict";a();r="decalFragment",d=`#ifdef DECAL
#ifdef GAMMADECAL
decalColor.rgb=toLinearSpace(decalColor.rgb);
#endif
#ifdef DECAL_SMOOTHALPHA
decalColor.a*=decalColor.a;
#endif
surfaceAlbedo.rgb=mix(surfaceAlbedo.rgb,decalColor.rgb,decalColor.a);
#endif
`;e.IncludesShadersStore[r]||(e.IncludesShadersStore[r]=d)});export{l as a};
