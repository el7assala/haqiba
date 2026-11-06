const C="haqiba-v6";
const CORE=["./","./index.html","./manifest.webmanifest","./icons/icon-192.png","./icons/icon-512.png","./icons/icon-maskable-512.png","./icons/apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request; if(r.method!=="GET")return;
  if(r.mode==="navigate"){ // newest version when online, saved copy when offline
    e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put("./index.html",cp));return res}).catch(()=>caches.match("./index.html")));
    return;
  }
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(hit=>hit||fetch(r).then(res=>{if(res&&(res.ok||res.type==="opaque")){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res})));
});
