import{a as e,b as o}from"./chunk-RR3YIVG4.js";import{e as l}from"./chunk-FAF55DAL.js";var i,d,P,f=l(()=>{o();i="clipPlaneVertex",d=`#ifdef CLIPPLANE
fClipDistance=dot(worldPos,vClipPlane);
#endif
#ifdef CLIPPLANE2
fClipDistance2=dot(worldPos,vClipPlane2);
#endif
#ifdef CLIPPLANE3
fClipDistance3=dot(worldPos,vClipPlane3);
#endif
#ifdef CLIPPLANE4
fClipDistance4=dot(worldPos,vClipPlane4);
#endif
#ifdef CLIPPLANE5
fClipDistance5=dot(worldPos,vClipPlane5);
#endif
#ifdef CLIPPLANE6
fClipDistance6=dot(worldPos,vClipPlane6);
#endif
`;e.IncludesShadersStore[i]||(e.IncludesShadersStore[i]=d);P={name:i,shader:d}});export{P as a,f as b};
